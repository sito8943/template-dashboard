// @ts-check
const Router = require("./router");

// auth
const { validator } = require("../utils/secure");

const userTypesRouter = new Router("userTypes", [validator]);

module.exports = userTypesRouter.router;
