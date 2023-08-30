#!/usr/bin/env node

const config = require("../config");

const { update } = require("sito-node-mysql");

/**
 * Module dependencies.
 */

const app = require("../app");
const debug = require("debug")("issf:server");

/**
 * Get port from environment and store in Express.
 */

const port = config.port;
app.set("port", port);

const { Server } = require("socket.io");

/**
 * Create HTTP server.
 */

const server = app.listen(port, async () => {
  console.info(`Server listening on port ${port}`);
});

server.on("error", onError);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const { v4 } = require("uuid");
const cron = require("node-cron");

const userSocketsConnections = {};

io.on("connection", (socket) => {
  const newId = v4();
  var localSocket = socket;
  console.info(`New user connection ${newId}`);

  socket.emit("user-logged", { id: newId, date: new Date().getTime() });

  socket.on("send-user-id", (user) => {
    console.info("user and socket connection", user);
    userSocketsConnections[user] = { socket: localSocket };
    io.emit("user-update-state", { user, to: "connected" });
  });

  socket.on("disconnect", (socket) => {
    console.info(socket);
    console.info("A user disconnected");
  });

  socket.on("reconnect", () => {
    console.info("Socket reconnected to server");
  });

  socket.on("reconnecting", () => {
    console.info("Socket attempting to reconnect to server");
  });
});

/**
 *
 * @param {string[]} array
 */
async function checkForUpdateState(array) {
  for (let i = 0; i < array.length; i += 1) {
    if (!userSocketsConnections[array[i]].connected) {
      console.info("idle socket found", array[i], "disconnecting");

      // @ts-ignore
      await update(
        "users",
        ["state", "lastOnline"],
        { state: 0, lastOnline: new Date().getTime() },
        [{ attribute: "user", operator: "=", value: array[i] }]
      );
      io.emit("user-update-state", { user: array[i], to: "disconnected" });
    } else {
      // not online calculates resources
    }
  }
  if (!array.length) console.info("Zzz No users online Zzz");
  else console.info(`${array.length} users online`);
}

/**
 * @see thisCron to check if a socket has been disconnected
 */
cron.schedule("* * * * *", async () => {
  try {
    console.info("update date");
    io.emit("plus-minute", new Date().getTime());
    const keys = Object.keys(userSocketsConnections);
    if (keys.length < 600000) checkForUpdateState(keys);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Listen on provided port, on all network interfaces.
 */

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
