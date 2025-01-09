import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import jwt from "jsonwebtoken";
import { add, differenceInSeconds } from "date-fns";
import { getCollection } from "../../lib/dbutils";
import { portalaccessCollection, portalaccessSchema } from "./model";
import { isEmptyOrSpaces } from "../../lib/Utils";

export const createPortalSession = async (
  space: string,
  name: string,
  token: string
) => {
  const model = getCollection(
    space,
    portalaccessCollection,
    portalaccessSchema
  );
  const appRoot = process.cwd();
  const publicKey = fs.readFileSync(appRoot + "/public.pem");
  try {
    const claims: any = await jwt.verify(token, publicKey);
    const data = {
      user: {
        user_id: claims.user_id,
        given_name: claims.given_name,
        family_name: claims.family_name,
        name: claims.name,
        nickname: claims.nickname,
        email: claims.email,
      },
      space,
    };

    const session = await model.create({
      name,
      apiKey: `${space}_${uuidv4()}`,
      claims: data,
    });

    return { outcome: true, apiKey: session.apiKey };
  } catch (err) {
    console.log(err);
    return { outcome: false, err };
  }
};

export const createPortalToken = async (apiKey: string) => {
  if (isEmptyOrSpaces(apiKey)) {
    return null;
  }
  const space = apiKey.split("_")[0];
  const model = getCollection(
    space,
    portalaccessCollection,
    portalaccessSchema
  );

  const response = await model.find({ apiKey });
  if (response.length === 0) {
    return null;
  }

  const appRoot = process.cwd();
  try {
    const privateKey = fs.readFileSync(appRoot + "/local_private.pem");
    const accessToken = jwt.sign(
      response[0].claims,
      { key: privateKey, passphrase: "ytrewq" },
      {
        algorithm: "RS256",
        expiresIn: "365d",
      }
    );
    return accessToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};
