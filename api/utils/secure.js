var CryptoJS = require("crypto-js");

const packageJson = require("../package.json");

const keys = [];
const connections = {};

const generateKey = (user1, user2) => {
  let key = "";
  if (user1.length > user2.length) {
    for (let i = 0; i < user1.length; i += 1) {
      if (i < user2.length) key += user1[i] + user2[i];
      else key += user1[i];
    }
  } else {
    for (let i = 0; i < user2.length; i += 1) {
      if (i < user1.length) key += user2[i] + user1[i];
      else key += user2[i];
    }
  }
  return key;
};

const { select, deleteDocuments } = require("sito-node-mysql");

const verifyBearer = async (auth) => {
  const credentials = auth.split(" ")[1];
  const bytes = CryptoJS.AES.decrypt(credentials, "app.elbule.com");
  var token = bytes.toString(CryptoJS.enc.Utf8);
  const [user, id, ip] = token.split("[!]");

  const responseToken = await select("tokens", ["token", "end"], {
    attribute: "idUser",
    operator: "=",
    value: id,
  });
  const { rows } = responseToken;
  if (rows.length) {
    const [data] = rows;
    const { end } = data;
    if (new Date().getTime() < Number(end)) {
      const remoteTokenRAW = CryptoJS.AES.decrypt(data.token, "app.elbule.com");
      const remoteToken = remoteTokenRAW.toString(CryptoJS.enc.Utf8);
      const [remoteUser, remoteId, remoteIp] = remoteToken.split("[!]");

      if (remoteUser === user && remoteId === id && remoteIp === ip)
        return { user };
    } else {
      await update(
        "users",
        ["status"],
        { status: 0 },
        { attribute: "id", operator: "=", value: id }
      );
      deleteDocuments("tokens", {
        attribute: "idUser",
        operator: "=",
        value: id,
      });
    }
    return false;
  }
  return false;
};

const version = packageJson.version;
// Set custom headers for write request
const headersFire = {
  "X-Node-Server": "true",
  "X-Custom-Header": `${version}`,
};

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

const validator = async (req, res, next) => {
  const ip = req.socket?.remoteAddress;

  if (req.headers.authorization) {
    if (req.headers.authorization.indexOf("Bearer ") === 0) {
      const verified = await verifyBearer(req.headers.authorization, ip);
      if (verified) return next();
    }
  }
  res.status(401);
  return next("Unauthorized");
};

module.exports = {
  verifyBearer,
  keys,
  headers,
  connections,
  headersFire,
  generateKey,
  validator,
};
