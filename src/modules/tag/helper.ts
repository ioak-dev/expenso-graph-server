const axios = require("axios");
// const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
const ONEAUTH_API = process.env.ONEAUTH_API || "https://api.ioak.io:8010/api";
import { tagCollection, tagSchema } from "./model";
const { getCollection } = require("../../lib/dbutils");
import * as ExpenseHelper from "../expense/helper";

export const updateTag = async (space: string, data: any, userId?: string) => {
  const model = getCollection(space, tagCollection, tagSchema);
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

  return await model.create(data);
};

export const getTag = async (space: string) => {
  const model = getCollection(space, tagCollection, tagSchema);

  return await model.find();
};

export const deleteByTransactionId = async (
  space: string,
  transactionId: string
) => {
  const model = getCollection(space, tagCollection, tagSchema);

  const tagList = await model.find({
    transactionId,
  });

  const tagIdList = await ExpenseHelper.getUnmappedTags(space, tagList);

  return await model.deleteMany({
    _id: { $in: tagIdList },
  });
};
