// @ts-check

import axios from "axios";
import config from "../config";
// @ts-ignore
import { getAuth } from "../auth/auth";

// cookies
// @ts-ignore
import { getCookie } from "some-javascript-utils/browser";

/**
 *
 * @param {string} value
 * @returns
 */
// @ts-ignore
export const fetch = async (value) => {
  let response;
  response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}text/fetch`,
    {
      id: value,
    },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  return await response.data;
};
