const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { getGlobalCollection, getCollection } from "../../lib/dbutils";
var fs = require("fs");
import * as Papa from "papaparse";
import { parse } from "date-fns";
import * as CategoryHelper from "../category/helper";
import * as TagHelper from "../tag/helper";

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
  const categoryMap = await _getCategoryMap(space);
  const tagMap = await _getTagMap(space);
  const payload = await _getTransformedPayload(
    space,
    content.data,
    categoryMap,
    tagMap
  );
  console.log(payload);

  return content;
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

const _getTransformedPayload = async (
  space: string,
  data: any[],
  categoryMap: any,
  tagMap: any
) => {
  const refDate = new Date();
  const res: any = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    categoryMap = await _createNewCategoryIfItDoesNotExist(
      space,
      categoryMap,
      item.category
    );

    const tagNameList = item.tag?.split(",") || [];
    const tagId: string[] = [];

    for (let i = 0; i < tagNameList.length; i++) {
      tagMap = await _createNewTagIfItDoesNotExist(
        space,
        tagMap,
        tagNameList[i]
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
  categoryName: string
) => {
  let matchingCategoryId = categoryMap[categoryName.toLowerCase()];
  if (matchingCategoryId) {
    return categoryMap;
  }
  const _categoryMap = { ...categoryMap };
  if (!matchingCategoryId) {
    _categoryMap[
      categoryName.toLowerCase()
    ] = await CategoryHelper.updateCategory(space, {
      name: categoryName,
    });
  }

  return _categoryMap;
};

const _createNewTagIfItDoesNotExist = async (
  space: string,
  tagMap: any,
  tagName: string
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
      })
    )?._id;
  }

  return _tagMap;
};
