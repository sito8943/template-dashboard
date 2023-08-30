// path
const path = require("path");

// uuid
const uuid = require("uuid");

// morgan
const morgan = require("morgan");
morgan.token("id", function getId(req) {
  return req.id;
});

const structure = morgan(":id :method :url :response-time");

const dev = morgan("dev", {
  skip: function (req, res) {
    return res.status < 400;
  },
});

const assignId = (req, res, next) => {
  req.id = uuid.v4();
  next();
};

// limiter
const rateLimit = require("express-rate-limit");

const mLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message:
    "Too many accounts created from this IP, please try again after a minute",
});

// favicon
// const fav = favicon(path.join(__dirname, "../public", "favicon.ico"));

const cors = require("cors");

const whitelist = [
  "http://127.0.0.1:3001",
  "http://localhost:3001",
  "http://localhost:5173",
];

const helmet = require("helmet");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");

module.exports = {
  morgan: { assignId, structure, dev },
  helmet: helmet(),
  cors: cors({ origin: whitelist }),
  limiter: mLimiter,
  favicon,
  cookieParser,
};
