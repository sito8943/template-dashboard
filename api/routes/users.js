// @ts-check
var CryptoJS = require("crypto-js");
const fs = require("fs");
const Router = require("./router");

// mysql
const { insert, select } = require("sito-node-mysql");

// auth
const { validator } = require("../utils/secure");

const userRouter = new Router("users", [validator]);

userRouter.addRoute("/save", "POST", [validator], async (req, res) => {
  console.info(`saving users`);
  const ip = req.socket?.remoteAddress;
  const { data } = req.body;

  try {
    // validating user
    const existedCI = await select(
      "users",
      ["id", "user", "email"],
      [
        { attribute: "user", value: data.user, operator: "=" },
        { attribute: "email", value: data.email, operator: "=", logic: "OR" },
      ]
    );
    if (existedCI.rows.length) {
      if (existedCI.rows[0].email === data.email)
        res.status(200).send({ message: "email" });
      else if (existedCI.rows[0].user === data.user)
        res.status(200).send({ message: "user" });
    } else {
      const result = await insert(
        "users",
        [
          "id",
          "user",
          "name",
          "email",
          "photo",
          "type",
          "banner",
          "pw",
          "date",
        ],
        { ...data, date: new Date().getTime(), photo: "", banner: "" }
      );
      console.info(`user created successfully`);

      const expiration = 1;
      const token =
        /* It's encrypting the token */
        CryptoJS.AES.encrypt(
          `${data.user}[!]${result}[!]${ip}`,
          "app.elbule.com"
        ).toString();
      const startDate = new Date();
      const endDate = startDate;
      endDate.setDate(startDate.getDate() + expiration);
      await insert("tokens", ["id", "idUser", "start", "end", "token"], {
        idUser: result,
        start: startDate.getTime(),
        end: endDate.getTime(),
        token,
      });
      console.info(`user logged successfully`);
      // @ts-ignore
      res.status(200).send({ id: result, user: data.user, token, expiration });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: String(err) });
  }
});

module.exports = userRouter.router;
