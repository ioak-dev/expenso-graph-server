import * as Helper from "./helper";

const selfRealm = 100;

export const importExpense = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const response: any = await Helper.importExpense(
    req.params.space,
    req.file,
    userId
  );
  res.status(200);
  res.send(response);
  res.end();
};
