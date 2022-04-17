const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { getGlobalCollection, getCollection } from "../../lib/dbutils";
var fs = require("fs");
import * as Papa from "papaparse";
import { format, parse } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import * as CategoryHelper from "../category/helper";
import * as ExpenseHelper from "../expense/helper";
import * as TagHelper from "../tag/helper";
import * as ReceiptHelper from "../bill/helper";
import * as LogHelper from "./log/helper";
import { isEmptyOrSpaces } from "../../lib/Utils";

const refDate = new Date();

export const deleteTransaction = async (
  space: string,
  transactionId: string,
  userId: string
) => {
  await ExpenseHelper.deleteByTransactionId(space, transactionId);
  await ReceiptHelper.deleteByTransactionId(space, transactionId);
  await CategoryHelper.deleteByTransactionId(space, transactionId);
  await TagHelper.deleteByTransactionId(space, transactionId);
  await LogHelper.deleteLogByTransactionId(space, transactionId);
};

export const importExpense = async (
  space: string,
  file: any,
  userId: string
) => {
  const content = Papa.parse(file.buffer.toString("utf8"), {
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\r\n",
    skipEmptyLines: true,
  });
  const transactionId = uuidv4();
  const categoryMap = await _getCategoryMap(space);
  const tagMap = await _getTagMap(space);
  const lineItemsPayload = await _getTransformedPayload(
    space,
    content.data,
    categoryMap,
    tagMap,
    transactionId
  );
  const [receiptResponse, lineItemsPayloadTransformed] = await _createReceipts(
    space,
    lineItemsPayload,
    content.data,
    transactionId
  );
  const expenseResponse = await ExpenseHelper.updateExpenseInBulk(
    space,
    lineItemsPayloadTransformed
  );

  let _total = 0;

  expenseResponse.forEach((item: any) => {
    _total += item.amount;
  });

  const newCategoryMap = await _getCategoryMap(space);
  const newTagMap = await _getTagMap(space);

  const logResponse = await LogHelper.addLog(
    space,
    transactionId,
    new Date(),
    lineItemsPayloadTransformed.length,
    Object.values(receiptResponse).length,
    _total,
    Object.keys(newCategoryMap).length - Object.keys(categoryMap).length,
    Object.keys(newTagMap).length - Object.keys(tagMap).length
  );

  return {
    receipt: Object.values(receiptResponse),
    lineItem: expenseResponse,
    log: {
      ...logResponse._doc,
      transactionDate: format(logResponse.transactionDate, "yyyy-MM-dd"),
    },
  };
};

const _getCategoryMap = async (space: string) => {
  const categories = await CategoryHelper.getCategory(space);
  const _categoryMap: any = {};
  categories.forEach((item: any) => {
    _categoryMap[item.name.toLowerCase()] = item._id;
  });
  return _categoryMap;
};

const _getTagMap = async (space: string) => {
  const tags = await TagHelper.getTag(space);
  const _tagMap: any = {};
  tags.forEach((item: any) => {
    _tagMap[item.name.toLowerCase()] = item._id;
  });
  return _tagMap;
};

const _createReceipts = async (
  space: string,
  lineItemsPayload: any[],
  csvData: any[],
  transactionId: string
) => {
  const lineItemsPayloadTransformed = [...lineItemsPayload];
  const receiptMap: any = {};
  for (let i = 0; i < csvData.length; i++) {
    const csvRecord = csvData[i];
    if (!isEmptyOrSpaces(csvRecord.billNumber)) {
      const receiptKey = `${csvRecord.billNumber}-${csvRecord.date}`;
      if (receiptMap[receiptKey]) {
        receiptMap[receiptKey].total =
          receiptMap[receiptKey].total + parseInt(csvRecord.amount);
      } else {
        receiptMap[receiptKey] = {
          billDate: parse(csvRecord.date, "yyyy-MM-dd", refDate),
          number: csvRecord.billNumber,
          total: parseInt(csvRecord.amount),
          description: csvRecord.billDescription,
          transactionId,
          mode: "import",
        };
      }
    }
  }

  for (const [key, value] of Object.entries(receiptMap)) {
    const receipt = await ReceiptHelper.addBill(space, value);
    receiptMap[key] = receipt;
  }

  for (let i = 0; i < csvData.length; i++) {
    const lineItem = lineItemsPayloadTransformed[i];
    const csvRecord = csvData[i];
    if (!isEmptyOrSpaces(csvRecord.billNumber)) {
      const receiptKey = `${csvRecord.billNumber}-${csvRecord.date}`;
      lineItem.billId = receiptMap[receiptKey]?._id;
    }
    lineItem.transactionId = transactionId;
    lineItem.mode = "import";
  }

  return [receiptMap, lineItemsPayloadTransformed];
};

const _getTransformedPayload = async (
  space: string,
  data: any[],
  categoryMap: any,
  tagMap: any,
  transactionId: string
) => {
  const res: any = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    categoryMap = await _createNewCategoryIfItDoesNotExist(
      space,
      categoryMap,
      item.category,
      transactionId
    );

    const tagNameList = item.tag?.split(",") || [];
    const tagId: string[] = [];

    for (let i = 0; i < tagNameList.length; i++) {
      tagMap = await _createNewTagIfItDoesNotExist(
        space,
        tagMap,
        tagNameList[i],
        transactionId
      );
      tagId.push(tagMap[tagNameList[i].toLowerCase()]);
    }
    res.push({
      description: item.description,
      amount: item.amount,
      billDate: parse(item.date, "yyyy-MM-dd", refDate),
      category: categoryMap[item.category.toLowerCase()],
      tagId,
    });
  }

  return res;
};

const _createNewCategoryIfItDoesNotExist = async (
  space: string,
  categoryMap: any,
  categoryName: string,
  transactionId: string
) => {
  let matchingCategoryId = categoryMap[categoryName.toLowerCase()];
  if (matchingCategoryId) {
    return categoryMap;
  }
  const _categoryMap = { ...categoryMap };
  if (!matchingCategoryId) {
    _categoryMap[categoryName.toLowerCase()] = (
      await CategoryHelper.updateCategory(space, {
        name: categoryName,
        transactionId,
      })
    )?._id;
  }

  return _categoryMap;
};

const _createNewTagIfItDoesNotExist = async (
  space: string,
  tagMap: any,
  tagName: string,
  transactionId: string
) => {
  let matchingTagId = tagMap[tagName.toLowerCase()];
  if (matchingTagId) {
    return tagMap;
  }
  const _tagMap = { ...tagMap };
  if (!matchingTagId) {
    _tagMap[tagName.toLowerCase()] = (
      await TagHelper.updateTag(space, {
        name: tagName,
        transactionId,
      })
    )?._id;
  }

  return _tagMap;
};
