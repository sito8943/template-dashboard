import CryptoJS from "crypto-js";

import { getCookie } from "some-javascript-utils/browser";

import config from "../config";

export function encrypt(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    getCookie(config.basicKey)
  ).toString();
}

export function decrypt(data) {
  return CryptoJS.AES.decrypt(data, getCookie(config.basicKey)).toString(
    CryptoJS.enc.Utf8
  );
}
