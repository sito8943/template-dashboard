var CryptoJS = require("crypto-js");

const { select } = require("sito-node-mysql");

const express = require("express");

const router = express.Router();

const config = require("../config");

// utils
const { decrypt } = require("../utils/crypto");
const { validator, headers } = require("../utils/secure");

const allColors = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFFF00",
  "#FF69B4",
  "#FFA500",
  "#800080",
  "#FFFFFF",
  "#000000",
  "#808080",
  "#A52A2A",
  "#40E0D0",
  "#FFD700",
  "#C0C0C0",
  "#F5F5DC",
  "#32CD32",
  "#556B2F",
  "#008000",
  "#98FB98",
  "#228B22",
  "#ADFF2F",
  "#00A86B",
  "#87CEEB",
  "#000080",
  "#00CED1",
  "#0047AB",
  "#4169E1",
  "#4B0082",
  "#8A2BE2",
  "#CCCCFF",
  "#ADD8E6",
  "#00FFFF",
  "#0000FF",
  "#4682B4",
  "#B0E0E6",
  "#7FFFD4",
  "#000080",
  "#FFFF00",
  "#FFD700",
  "#FFDB58",
  "#FFFF99",
  "#FFB6C1",
  "#FFFF99",
  "#FFD700",
  "#FFBF00",
  "#FFC0CB",
  "#FF00FF",
  "#FFA07A",
  "#FF1493",
  "#FF6B81",
  "#FFB6C1",
  "#FFDAB9",
  "#FFDAB9",
  "#FF4500",
  "#FFA500",
  "#2E8B57",
  "#FF6347",
  "#DC143C",
  "#ADFF2F",
  "#F08080",
  "#FF00FF",
  "#800000",
  "#FF4500",
  "#808000",
  "#2E8B57",
  "#F0E68C",
  "#DDA0DD",
  "#D3D3D3",
  "#FF8C00",
  "#FFA07A",
  "#20B2AA",
  "#87CEFA",
  "#778899",
  "#B0C4DE",
  "#FFFFF0",
  "#00FF00",
  "#32CD32",
  "#FAF0E6",
  "#FF00FF",
  "#800080",
  "#FF4500",
  "#6A5ACD",
  "#00FA9A",
  "#48D1CC",
  "#20B2AA",
  "#5F9EA0",
  "#7FFF00",
  "#D2691E",
  "#FF7F50",
  "#6495ED",
  "#FFF8DC",
  "#DC143C",
  "#00FFFF",
  "#00008B",
  "#008B8B",
  "#B8860B",
  "#A9A9A9",
  "#006400",
  "#BDB76B",
  "#8B008B",
  "#556B2F",
  "#FF8C00",
  "#9932CC",
  "#8B0000",
  "#E9967A",
  "#8FBC8F",
  "#483D8B",
  "#2F4F4F",
  "#00CED1",
  "#9400D3",
  "#FF1493",
  "#00BFFF",
  "#696969",
  "#1E90FF",
  "#B22222",
  "#FFFAF0",
  "#228B22",
  "#FF00FF",
  "#DCDCDC",
  "#F8F8FF",
];

router.get("/list", [validator], async (req, res) => {
  try {
    const allEvents = await select("analytics", []);
    const events = allEvents.rows;
    console.info(`${events.length} retrieved successfully`);

    res.status(200).send({ list: events });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

const prepareDate = (year, month) => {
  console.log(year, month);
  const date = new Date();
  if (year) {
    date.setFullYear(year);
    date.setMonth(11);
  }
  if (month) date.setMonth(month);
  return date.getTime();
};

router.get("/attribute", [validator], async (req, res) => {
  const { year, month, attribute } = req.query;
  try {
    const date = prepareDate(Number(year), Number(month));

    const response = await select("basictrigger", [attribute], {
      attribute: "date",
      operator: "<=",
      value: date,
    });
    const result = {};
    const colors = [];
    const labels = [];
    const rows = response.rows;
    console.log(rows);
    let i = 0;
    rows.forEach((event) => {
      const att = event[attribute];
      if (result[att]) result[att].count += 1;
      else {
        colors.push(allColors[i]);
        i += 1;
        result[att] = { count: 1, label: att };
        labels.push(att);
      }
    });

    const series = Object.values(result).map((value) => value.count);
    res.status(200).send({ colors, labels, series });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

router.get("/fetch", [validator], async (req, res) => {
  const { params, year, month } = req.query;
  const decrypted = JSON.parse(decrypt(params));
  const { events } = decrypted;
  const date = prepareDate(Number(year), Number(month));
  try {
    // fetching by day
    const response = await select(
      ["basictrigger", "analytics"],
      [],
      [
        {
          attribute: "basictrigger.date",
          operator: "<=",
          value: Number(date),
        },
        {
          attribute: "basictrigger.idEvent",
          operator: "=",
          value: "analytics.id",
          logic: "AND",
        },
        ...events.map((event, i) => {
          const toReturn = {
            attribute: "idEvent",
            operator: "=",
            value: event,
          };
          if (i > 0 && i < events.length - 1)
            return {
              ...toReturn,
              logic: "OR",
            };
          if (i === events.length - 1)
            return { ...toReturn, logic: "OR", parenthesis: ")" };
          return {
            ...toReturn,
            logic: "AND",
            parenthesis: "(",
          };
        }),
      ]
    );
    const rows = response.rows;
    // grouping by id

    const resultObj = {};
    let categories = [];
    // by year categories are 12 months
    if (Number(year)) categories = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (Number(month)) {
      const theYearMonthDate = new Date(
        Number(year),
        Number(month),
        0
      ).getDate();
      categories = new Array(theYearMonthDate).fill(0);
    }
    rows.forEach((event) => {
      if (!resultObj[event.idEvent])
        resultObj[event.idEvent] = {
          id: event.idEvent,
          name: event.name,
          color: event.color,
        };
      // if not initialized creates copy of categories
      if (!resultObj[event.idEvent].data)
        resultObj[event.idEvent].data = [...categories];
      const { date } = event;
      const thatDate = new Date(date);
      if (Number(year) && !Number(month))
        resultObj[event.idEvent].data[thatDate.getMonth()] += 1;
      else resultObj[event.idEvent].data[thatDate.getDate()] += 1;
    });
    categories.forEach((category, i) => {
      categories[i] = i + 1;
    });
    res.status(200).send({ series: Object.values(resultObj), categories });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

router.post("/trigger", async (req, res) => {});

module.exports = router;
