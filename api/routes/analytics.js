var CryptoJS = require("crypto-js");

const { select } = require("sito-node-mysql");

const express = require("express");

const router = express.Router();

const config = require("../config");

// utils
const { decrypt } = require("../utils/crypto");
const { validator, headers } = require("../utils/secure");

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

router.get("/fetch", [validator], async (req, res) => {
  const { params, year, month, day } = req.query;
  const decrypted = JSON.parse(decrypt(params));
  const { events } = decrypted;
  let { date } = req.query;
  if (!date) {
    date = new Date().getTime();
    if (year) date.setFullYear(year);
    if (month) date.setMonth(month);
    if (day) date.setDate(day);
  }
  try {
    // fetching by day
    const response = await select(
      "basictrigger",
      [],
      [
        {
          attribute: "date",
          operator: "<=",
          value: Number(date),
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
    const resultObj = {};
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

router.post("/trigger", async (req, res) => {});

module.exports = router;
