const CryptoJS = require("crypto-js");

const config = require("../config");

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), config.crypto).toString();
}

function decrypt(data) {
  return CryptoJS.AES.decrypt(data, config.crypto).toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encrypt,
  decrypt,
};
