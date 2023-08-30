// @ts-check
var CryptoJS = require("crypto-js");
const fs = require("fs");
const Router = require("./router");

// mysql
const { insert, select } = require("sito-node-mysql");

// auth
const { validator } = require("../utils/secure");

const mipymeRouter = new Router("mipymes", [validator]);

mipymeRouter.addRoute("/save", "POST", [], async (req, res) => {
  console.info(`saving mipyme`);

  const { data } = req.body;

  try {
    // validating mipyme
    const existedName = await select(
      "mipymes",
      ["id", "name"],
      [{ attribute: "name", value: data.name, operator: "=" }]
    );
    if (existedName.rows.length) {
      res.status(200).send({ message: "name" });
    } else {
      const result = await insert(
        "mipymes",
        ["id", "name", "description", "email", "photo", "owner", "date"],
        { ...data, date: new Date().getTime() }
      );
      console.info(`mipyme created successfully`);
      // @ts-ignore
      res.status(200).send({ id: result });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: String(err) });
  }
});

module.exports = mipymeRouter.router;
