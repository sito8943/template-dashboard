// @ts-check

const express = require("express");

const { login, signOut } = require("../controllers/auth");

const router = express.Router();

// auth
const { validator, headers } = require("../utils/secure");

router.post("/validate", [validator], async (req, res) => {
  try {
    const { user } = req.body;
    res.status(200).send({ status: 200, data: { user } });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
    return;
  }
});

router.post("/login", async (req, res) => {
  console.info("Logging user");
  try {
    const ip = req.socket?.remoteAddress;
    const { user, password, remember } = req.body;
    const result = await login(user, password, remember, ip || "");
    if (result.status === 200) console.info(`${user} logged successful`);
    else if (result.status === 422) console.error(`${user} ${result.error}`);
    else console.error(result.data.error);
    res.status(result.status).send({ ...result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

router.post("/sign-out", async (req, res) => {
  try {
    const ip = req.socket?.remoteAddress;
    const { user } = req.body;
    // @ts-ignore
    const result = await signOut(user, ip);
    res.status(result.status).send(result.data);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
    return;
  }
});

module.exports = router;
