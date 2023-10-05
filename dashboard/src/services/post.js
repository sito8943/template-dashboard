import { getAuth } from "../auth/auth";
import config from "../config";

// some-javascript-utils
import { getCookie } from "some-javascript-utils/browser";

import { getUserName } from "../utils/auth";

/**
 *
 * @param {string} collection
 * @param {object} data
 */
export const saveModel = async (collection, data) => {
  const response = await fetch(
    `${config.apiUrl}${collection}/${
      data.id === undefined ? "insert" : "update"
    }`,
    {
      method: "POST",
      body: JSON.stringify({ user: getUserName(), data }),
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
  const response = await fetch(`${config.apiUrl}${collections[0]}/save-union`, {
    method: "POST",
    body: JSON.stringify({ user: getUserName(), collections, data }),
    headers: {
      ...getAuth,
      Authorization: `Bearer ${getCookie(config.basicKey)}`,
    },
  });
  return response;
};

/**
 *
 * @param {string} collection
 * @param {string} id
 */
export const deleteModel = async (collection, id) => {
  const response = await fetch(`${config.apiUrl}${collection}/delete`, {
    method: "POST",
    body: JSON.stringify({ user: getUserName, ids: [id] }),
    headers: {
      ...getAuth,
      Authorization: `Bearer ${getCookie(config.basicKey)}`,
    },
  });
  return response;
};
