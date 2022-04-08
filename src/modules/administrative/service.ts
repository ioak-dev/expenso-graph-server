import * as Helper from "./helper";

const selfRealm = 100;

export const importExpense = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const company: any = await Helper.importExpense(req.file, userId);
  res.status(200);
  res.send(company);
  res.end();
};
