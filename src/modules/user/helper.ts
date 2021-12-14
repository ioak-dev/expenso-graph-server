const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { userSchema, userCollection } from "./model";
const { getCollection } = require("../../lib/dbutils");
import * as Helper from "./helper";

export const decodeAccessToken = async (space: number, accessToken: string) => {
  let decodedResponse = null;
  try {
    decodedResponse = await axios.get(`${ONEAUTH_API}/auth/token/decode`, {
      headers: {
        authorization: accessToken,
      },
    });
  } catch (err) {
    if (err.response.status === 401) {
      return "expired";
    }
  }

  if (decodedResponse.status === 200) {
    const model = getCollection(space, userCollection, userSchema);
    const data = await model.findByIdAndUpdate(
      decodedResponse.data.user_id,
      {
        ...decodedResponse.data,
        resolver: "oneauth_space",
      },
      { new: true, upsert: true }
    );
    return decodedResponse.data || null;
  }

  return null;
};

export const getNewAccessToken = async (
  space: number,
  refreshToken: string
) => {
  const refreshTokenResponse = await axios.post(`${ONEAUTH_API}/auth/token`, {
    grant_type: "refresh_token",
    realm: space,
    refresh_token: refreshToken,
  });

  if (refreshTokenResponse.status === 200) {
    return refreshTokenResponse.data;
  }

  return null;
};

export const validateSession = async (
  accessToken: string,
  refreshToken: string,
  space: any
) => {
  const model = getCollection(space, userCollection, userSchema);
  const accessTokenResponse = await Helper.decodeAccessToken(
    Number(space),
    accessToken
  );
  console.log(space, accessTokenResponse);

  if (accessTokenResponse !== "expired") {
    return {
      accessToken: null,
      claims: accessTokenResponse,
    };
  }

  const newAccessToken = await Helper.getNewAccessToken(space, refreshToken);

  if (newAccessToken?.access_token) {
    const newAccessTokenResponse = await Helper.decodeAccessToken(
      space,
      newAccessToken.access_token
    );

    return {
      accessToken: newAccessToken.access_token,
      claims: newAccessTokenResponse,
    };
  }

  return null;
  // const response = await model.findOneAndUpdate(
  //   { email: args.payload.email, resolver: "email" },
  //   { ...args.payload, resolver: "email" },
  //   { upsert: true, new: true, rawResult: true }
  // );
  // return response.value;
};
