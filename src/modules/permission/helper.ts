const axios = require("axios");
// const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
const ONEAUTH_API = process.env.ONEAUTH_API || "https://api.ioak.io:8010/api";
const ONEAUTH_API_KEY = process.env.ONEAUTH_API_KEY || "621be1c5-52f3-4de9-9bd7-69c263c4b744";
const ONEAUTH_REALM_ID = process.env.ONEAUTH_REALM_ID || "228"

export const addRole = async (email: string, companyId: string) => {
  let response = null;
  console.log(email, companyId);
  try {
    response = await axios.post(`${ONEAUTH_API}/${ONEAUTH_REALM_ID}/admin/permission`, {
      action: "ADD",
      userEmail: email,
      roleName: "COMPANY_ADMIN",
      scope: companyId
    }, {
      headers: {
        authorization: ONEAUTH_API_KEY,
      },
    });
  } catch (err) {
    console.log("*", err);
    return {};
  }

  if (response.status === 200) {
    return response.data || null;
  }

  return null;
};

