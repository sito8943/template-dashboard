/**
 * string
 */
const toSlug = (string) => {
  const accents = ["á", "é", "í", "ó", "ú", "ü", "ñ"];
  const vocals = ["a", "e", "i", "o", "u", "u", "n"];
  let parsedStrings = string
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

  // transform vocals
  accents.forEach((accent, i) => {
    if (parsedStrings.indexOf(accent) > -1)
      parsedStrings = parsedStrings.replaceAll(accent, vocals[i]);
  });
  return parsedStrings;
};

/**
 *
 * @param {object} page

 */
function parsePaginationFromQuery(query) {
  const { page, count } = query;
  const parsedPage = page !== undefined ? Number(page) : 0;
  const parsedCount = count !== undefined ? Number(count) : 10;
  const data = { page: parsedPage, count: parsedCount };
  return data;
}

module.exports = { parsePaginationFromQuery, toSlug };
