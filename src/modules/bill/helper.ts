const axios = require("axios");
import { parse } from "date-fns";
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { billCollection, billSchema } from "./model";
import { expenseCollection, expenseSchema } from "../expense/model";
import { isEmptyOrSpaces } from "../../lib/Utils";
import { format } from "date-fns";
const { getCollection } = require("../../lib/dbutils");

export const updateBill = async (space: string, data: any, userId: string) => {
  const billPayload = {
    _id: data._id,
    billDate: data.billDate,
    number: data.number,
    total: data.total,
    description: data.description,
  };

  const model = getCollection(space, billCollection, billSchema);
  const expenseModel = getCollection(space, expenseCollection, expenseSchema);
  let billResponse: any = {};
  if (data._id) {
    billResponse = await model.findByIdAndUpdate(
      billPayload._id,
      {
        ...billPayload,
      },
      { new: true, upsert: true }
    );
  } else {
    billResponse = await model.create({ ...data, mode: "Manual" });
  }

  const _existingExpenseIdList: string[] = [];
  data.items.forEach((item: any) => {
    if (item._id) {
      _existingExpenseIdList.push(item._id);
    }
  });

  await expenseModel.deleteMany({
    billId: billResponse._id,
    _id: { $nin: _existingExpenseIdList },
  });

  const expensePayload: any[] = [];

  data.items.forEach((item: any) => {
    if (
      !isEmptyOrSpaces(item.category) &&
      !isEmptyOrSpaces(item.description) &&
      item.amount > 0
    ) {
      if (item._id) {
        expensePayload.push({
          updateOne: {
            filter: {
              _id: item._id,
            },
            update: {
              billId: billResponse._id,
              // billDate: parse(data.billDate, "yyyy-MM-dd", new Date()),
              billDate: new Date(data.billDate),
              category: item.category,
              description: item.description,
              amount: item.amount,
              mode: "Manual",
            },
            upsert: true,
          },
        });
      } else {
        expensePayload.push({
          insertOne: {
            document: {
              billId: billResponse._id,
              // billDate: parse(data.billDate, "yyyy-MM-dd", new Date()),
              billDate: new Date(data.billDate),
              category: item.category,
              description: item.description,
              amount: item.amount,
              mode: "Manual",
            },
          },
        });
      }
    }
  });

  const expenseResponse = await expenseModel.bulkWrite(expensePayload);

  console.log(expenseResponse);
  console.log(
    billResponse._id,
    await expenseModel.find({ billId: billResponse._id })
  );
  const response = {
    ...billResponse._doc,
    billDate: format(billResponse._doc.billDate, "yyyy-MM-dd"),
    items: await expenseModel.find({ billId: billResponse._id }),
  };

  return response;
};

export const getBill = async (space: string) => {
  const model = getCollection(space, billCollection, billSchema);

  return await model.find();
};

export const getBillById = async (space: string, id: string) => {
  const model = getCollection(space, billCollection, billSchema);
  const expenseModel = getCollection(space, expenseCollection, expenseSchema);

  const billResponse = await model.findOne({ _id: id });
  const expenseResponse = await expenseModel.find({ billId: billResponse._id });

  return {
    ...billResponse._doc,
    billDate: format(billResponse._doc.billDate, "yyyy-MM-dd"),
    items: expenseResponse,
  };
};

export const searchReceipt = async (space: string, searchCriteria: any) => {
  const pageNo = searchCriteria.pagination?.pageNo || 0;
  const pageSize = searchCriteria.pagination?.pageSize || 10;
  const hasMore = searchCriteria.pagination?.hasMore;

  const sortCondition: any = {};
  if (searchCriteria.pagination?.sortBy) {
    sortCondition[searchCriteria.pagination?.sortBy] =
      searchCriteria.pagination?.sortOrder === "descending" ? -1 : 1;
  }

  if (searchCriteria.pagination?.sortBy !== "billDate") {
    sortCondition.billDate = "descending";
  }

  if (!hasMore) {
    return {
      results: [],
      pageNo,
      pageSize,
      hasMore,
    };
  }

  const model = getCollection(space, billCollection, billSchema);

  const _condition: any[] = _constructSearchCondition(searchCriteria);
  const response = await model
    .find(_condition.length > 0 ? { $and: _condition } : {})
    .collation({ locale: "en" })
    .sort(sortCondition)
    .skip(pageNo * pageSize)
    .limit(pageSize);

  return {
    results: response.map((record: any) => {
      return {
        ...record._doc,
        _id: record._id,
        billDate: format(record.billDate, "yyyy-MM-dd"),
        description: record.description,
        number: record.number,
        total: record.total,
      };
    }),
    pageNo: response.length === pageSize ? pageNo + 1 : pageNo,
    pageSize,
    hasMore: response.length === pageSize ? true : false,
  };
};

const _constructSearchCondition = (searchCriteria: any) => {
  const _condition: any[] = [];
  if (!isEmptyOrSpaces(searchCriteria.description)) {
    _condition.push({ $text: { $search: searchCriteria.description } });
  }

  if (!isEmptyOrSpaces(searchCriteria.from)) {
    _condition.push({
      billDate: { $gte: parse(searchCriteria.from, "yyyy-MM-dd", new Date()) },
    });
  }

  if (!isEmptyOrSpaces(searchCriteria.to)) {
    let _toDate = parse(searchCriteria.to, "yyyy-MM-dd", new Date());
    _toDate = new Date(
      _toDate.getFullYear(),
      _toDate.getMonth(),
      _toDate.getDate(),
      23,
      59,
      59
    );
    _condition.push({ billDate: { $lte: _toDate } });
  }

  if (searchCriteria.days && searchCriteria.days !== 0) {
    let _fromDate = new Date(
      new Date().getTime() - (searchCriteria.days - 1) * 24 * 60 * 60 * 1000
    );
    _fromDate = new Date(
      _fromDate.getFullYear(),
      _fromDate.getMonth(),
      _fromDate.getDate(),
      0,
      0,
      0
    );
    _condition.push({
      billDate: {
        $gte: _fromDate,
      },
    });
  }

  if (searchCriteria.months && searchCriteria.months !== 0) {
    let _baseDate = new Date();
    _baseDate = new Date(
      _baseDate.setMonth(_baseDate.getMonth() - searchCriteria.months + 1)
    );
    let _fromDate = new Date(
      _baseDate.getFullYear(),
      _baseDate.getMonth(),
      1,
      0,
      0,
      0
    );

    _condition.push({
      billDate: {
        $gte: _getStartOfTheDay(_fromDate),
      },
    });
  }

  if (searchCriteria.monthNumber && searchCriteria.monthNumber !== 0) {
    let _baseDate = new Date();
    _baseDate = new Date(
      _baseDate.setMonth(_baseDate.getMonth() - searchCriteria.monthNumber + 1)
    );
    let _fromDate = new Date(
      _baseDate.getFullYear(),
      _baseDate.getMonth(),
      1,
      0,
      0,
      0
    );
    let _toDate = new Date(
      _baseDate.getFullYear(),
      _baseDate.getMonth(),
      31,
      23,
      59,
      59
    );

    _condition.push({
      $and: [
        {
          billDate: {
            $gte: _fromDate,
          },
        },
        {
          billDate: {
            $lte: _toDate,
          },
        },
      ],
    });
  }

  if (searchCriteria.yearNumber && searchCriteria.yearNumber !== 0) {
    let _fromDate = new Date();
    _fromDate = new Date(
      _fromDate.getFullYear() - searchCriteria.yearNumber + 1,
      0,
      1,
      0,
      0,
      0
    );

    let _toDate = new Date();
    _toDate = new Date(
      _toDate.getFullYear() - searchCriteria.yearNumber + 1,
      11,
      31,
      23,
      59,
      59
    );

    _condition.push({
      $and: [
        {
          billDate: {
            $gte: _fromDate,
          },
        },
        {
          billDate: {
            $lte: _toDate,
          },
        },
      ],
    });
  }

  if (searchCriteria.moreThan && searchCriteria.moreThan !== 0) {
    _condition.push({ total: { $gte: searchCriteria.moreThan } });
  }

  if (searchCriteria.lessThan && searchCriteria.lessThan !== 0) {
    _condition.push({ total: { $lte: searchCriteria.lessThan } });
  }

  return _condition;
};

const _getStartOfTheDay = (_date: Date) => {
  return new Date(
    _date.getFullYear(),
    _date.getMonth(),
    _date.getDate(),
    0,
    0,
    0
  );
};

export const addBill = async (space: string, data: any) => {
  const model = getCollection(space, billCollection, billSchema);
  return await model.create(data);
};

export const deleteByScheduleId = async (space: string, scheduleId: string) => {
  const model = getCollection(space, billCollection, billSchema);

  return await model.remove({
    scheduleId,
  });
};

export const deleteByScheduleIdAndBillDate = async (
  space: string,
  scheduleId: string,
  billDate: Date
) => {
  const model = getCollection(space, billCollection, billSchema);

  return await model.remove({
    scheduleId,
    billDate,
  });
};
