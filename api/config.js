const dotenv = require("dotenv").config({ path: ".env" });
const assert = require("assert");

const { PORT, BD_HOST, BD_USER, BD_PASSWORD, BD_DATABASE } = process.env;

assert(PORT, "PORT is required");

const config = {
  port: PORT,
  bdHost: BD_HOST,
  bdUser: BD_USER,
  bdPassword: BD_PASSWORD,
  bdDatabase: BD_DATABASE,
};

module.exports = config;
