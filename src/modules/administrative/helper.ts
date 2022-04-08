const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { getGlobalCollection, getCollection } from "../../lib/dbutils";
var fs = require("fs");

export const importExpense = async (file: any, userId: string) => {
  console.log(typeof file, file.buffer.toString("utf8"));
};
