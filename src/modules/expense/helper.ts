const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { expenseCollection, expenseSchema } from "./model";
const { getCollection } = require("../../lib/dbutils");
import * as Helper from "./helper";
import { isEmptyOrSpaces } from "../../lib/Utils";
import { format, parse } from "date-fns";

export const updateExpense = async (
  space: string,
  data: any,
  userId: string
) => {
  const model = getCollection(space, expenseCollection, expenseSchema);
  if (data._id) {
    const response = await model.findByIdAndUpdate(
      data._id,
      {
        ...data,
      },
      { new: true, upsert: true }
    );
    return response;
  }

  return await model.create({ ...data, mode: "Manual" });
};

export const getExpense = async (space: string) => {
  const model = getCollection(space, expenseCollection, expenseSchema);

  const response = await model.find();
  return response.map((record: any) => {
    return {
      ...record,
      _id: record._id,
      billDate: format(record.billDate, "yyyy-MM-dd"),
      category: record.category,
      description: record.description,
      amount: record.amount,
      billId: record.billId,
    };
  });
};

export const searchExpense = async (space: string, searchCriteria: any) => {
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

  const model = getCollection(space, expenseCollection, expenseSchema);

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
        category: record.category,
        description: record.description,
        amount: record.amount,
        billId: record.billId,
      };
    }),
    pageNo: response.length === pageSize ? pageNo + 1 : pageNo,
    pageSize,
    hasMore: response.length === pageSize ? true : false,
  };
};

export const aggregateExpense = async (space: string, searchCriteria: any) => {
  const model = getCollection(space, expenseCollection, expenseSchema);

  const _condition: any[] = _constructSearchCondition(searchCriteria);
  const response = await model.aggregate([
    { $match: _condition.length > 0 ? { $and: _condition } : {} },
    { $group: { _id: "", total: { $sum: "$amount" } } },
  ]);

  return { total: response.length > 0 ? response[0].total : 0 };
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
    _condition.push({ amount: { $gte: searchCriteria.moreThan } });
  }

  if (searchCriteria.lessThan && searchCriteria.lessThan !== 0) {
    _condition.push({ amount: { $lte: searchCriteria.lessThan } });
  }

  if (
    searchCriteria.categoryIdList &&
    searchCriteria.categoryIdList.length > 0
  ) {
    _condition.push({ category: { $in: searchCriteria.categoryIdList } });
  }

  if (searchCriteria.tagIdList && searchCriteria.tagIdList.length > 0) {
    _condition.push({ tagId: { $in: searchCriteria.tagIdList } });
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

export const updateExpenseInBulk = async (space: string, data: any) => {
  const model = getCollection(space, expenseCollection, expenseSchema);
  return await model.insertMany(data);
};

export const deleteByScheduleId = async (space: string, scheduleId: string) => {
  const model = getCollection(space, expenseCollection, expenseSchema);
  return await model.remove({ scheduleId });
};

export const deleteByScheduleIdAndBillDate = async (
  space: string,
  scheduleId: string,
  billDate: Date
) => {
  const model = getCollection(space, expenseCollection, expenseSchema);
  return await model.remove({ scheduleId, billDate });
};
