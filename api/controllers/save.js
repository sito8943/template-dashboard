// @ts-check

const { update, select, insert, deleteDocuments } = require("sito-node-mysql");
const fs = require("fs");

/**
 *
 * @param {string} user
 * @param {string} collection
 * @param {object} data
 */
const saveUnion = async (user, collection, data) => {
  const { rows } = await select("users", ["id"], {
    attribute: "user",
    operator: "=",
    value: user,
  });
  if (rows.length) {
    const userId = rows[0].id;
    const attributes = Object.keys(data);
    const id = await insert(collection, ["id", ...attributes, "date"], {
      ...data,
      date: String(new Date().getTime()),
    });
    return { status: 200, data: { id } };
  }
  return { status: 422, error: "error" };
};

module.exports = {
  saveUnion,
};
