// @ts-check
const Router = require("./router");

const { select } = require("sito-node-mysql");

// auth
const { validator } = require("../utils/secure");

const userRouter = new Router("users", [validator]);

userRouter.addRoute("/notifications", "GET", [validator], async (req, res) => {
  const { user } = req.query;
  try {
    // get user id
    const userResponse = await select("users", ["id"], {
      attribute: "user",
      operator: "=",
      value: user,
    });
    const userId = userResponse.rows[0].id;
    const notificationsResponse = await select("notifications", [], {
      attribute: "idUser",
      value: userId,
      operator: "=",
    });
    const notifications = notificationsResponse.rows;
    res.status(200).send({ list: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
    return;
  }
});

module.exports = userRouter.router;
