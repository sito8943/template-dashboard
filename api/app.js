// @ts-check
const express = require("express");
const path = require("path");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const mipymeRouter = require("./routes/mipymes");

const app = express();

const {
  helmet,
  cors,
  limiter,
  favicon,
  morgan,
  cookieParser,
} = require("./utils/middlewares");

app.set("etag", "strong"); //browser caching of static assets should work properly

app.use(express.json({ limit: 1048576 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// middle wares
app.use(limiter);
// morgan
app.use(morgan.assignId);
app.use(morgan.structure);
app.use(morgan.dev);
// helmet
app.use(helmet);
// cors
app.use(cors);

app.use(cookieParser());

const config = require("./config");
const { connection } = require("sito-node-mysql/connection");

connection.init(config);
const { insert } = require("sito-node-mysql");

app.use("/api/auth", authRouter);
app.use("/api-client/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api-client/users", usersRouter);
app.use("/api/mipymes", mipymeRouter);
app.use("/api-client/mipymes", mipymeRouter);
app.use("/api/posts", postRouter);
app.use("/api-client/posts", postRouter);

// errors logs
app.post("/error/logs", async (req, res) => {
  const { error, user } = req.body;
  try {
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(error),
      idUser: user,
      date: new Date().getTime(),
    });
    res.send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = app;
