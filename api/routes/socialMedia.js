// @ts-check
const Router = require("./router");

// auth
const { validator } = require("../utils/secure");

const socialMediaRouter = new Router("socialMedia", [validator]);

module.exports = socialMediaRouter.router;
