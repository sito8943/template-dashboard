import axios from "axios";
import { getAuth } from "../auth/auth";
import config from "../config";

// some-javascript-utils
import { getCookie } from "some-javascript-utils/browser";

import { getUserId, getUserName } from "../utils/auth";

/**
 *
 * @param {string} collection
 * @param {object} data
 */
export const saveModel = async (collection, data) => {
  const response = await axios.post(
    `${config.apiUrl}${collection}/${
      data.id === undefined ? "save" : "update"
    }`,
    {
      user: getUserName(),
      data,
    },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  return response;
};

/**
 *
 * @param {string} collection
 * @param {object} data
 */
export const saveUnionModels = async (collections, data) => {
  const response = await axios.post(
    `${config.apiUrl}${collections[0]}/save-union`,
    {
      user: getUserName(),
      collections,
      data,
    },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  return response;
};

/**
 *
 * @param {string} collection
 * @param {string} id
 */
export const deleteModel = async (collection, id) => {
  const response = await axios.post(
    `${config.apiUrl}${collection}/delete`,
    {
      user: getUserId(),
      ids: [id],
    },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  return response;
};
