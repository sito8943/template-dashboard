// @ts-check

const { select } = require("sito-node-mysql");

/**
 *
 * @param {string} user
 * @param {string[]} collections
 * @param {number} page
 * @param {number} count
 * @param {string[]} attributes
 * @param {any} query
 * @returns
 */
const unionList = async (
  user,
  collections,
  page,
  count,
  attributes = [],
  query = {}
) => {
  const parsedCount = count || 10;
  const parsedPage = page === undefined ? 0 : page;
  const rowTotalPages = await select(collections, ["FOUND_ROWS()"], query);
  if (rowTotalPages.rows.length) {
    const totalPages = rowTotalPages.rows[0]["FOUND_ROWS()"];
    const { rows } = await select(
      collections,
      attributes,
      query,
      parsedPage * parsedCount,
      (parsedPage + 1) * parsedCount
    );
    if (rows) {
      return {
        status: 200,
        page: parsedPage,
        list: rows,
        totalPages: count === -1 ? 1 : totalPages / parsedCount,
      };
    }
  }

  return {
    status: 200,
    page: 0,
    list: [],
    totalPages: 1,
  };
};

module.exports = {
  unionList,
};
