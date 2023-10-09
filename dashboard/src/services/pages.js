import { getCookie } from "some-javascript-utils/browser";

// auth
import { getAuth } from "../auth/auth";

// utils
import { getUserName } from "../utils/auth";

// config
import config from "../config";

export const savePage = async (page, data) => {
  const response = await fetch(
    // @ts-ignore
    `${config.apiUrl}pages/save`,
    {
      method: "POST",
      body: JSON.stringify({ page, data, user: getUserName() }),
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  return response;
};
