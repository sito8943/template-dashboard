/* eslint-disable no-use-before-define */
// @ts-check

import config from "../config";
import { validateBasicKey } from "../services/auth";

// @ts-ignore
import { deleteCookie, getCookie } from "some-javascript-utils/browser";

export const fromLocal = () => {
  const user = {};
  user.user = localStorage.getItem(config.user);
  user.photo = localStorage.getItem(config.userPhoto);
  user.state = localStorage.getItem(config.userState);
  return user;
};

export const getUserName = () => localStorage.getItem(config.user);
export const getUserId = () => localStorage.getItem(config.userId);

export const isAdmin = async () => {
  const value = await validateBasicKey("admin");
  if (value) return true;
  return false;
};

/**
 * If the user is logged in, return true, otherwise return false.
 */
export const userLogged = () =>
  // @ts-ignore
  getCookie(config.basicKey).length > 0;

export const logoutUser = () => {
  // @ts-ignore
  deleteCookie(config.basicKey);
  localStorage.removeItem(config.user);
  localStorage.removeItem(config.userPhoto);
  localStorage.removeItem(config.userState);
};

/**
 * If remember is true, it stores user data to localStorage, otherwise it stores it in sessionStorage
 * @param {boolean} remember - a boolean value that determines whether the user should be remembered or not.
 * @param {object} data - The user object that you want to store in the browser.
 */
export const logUser = (remember, data) => {
  if (data.id) localStorage.setItem(config.userId, data.id);
  if (data.user) localStorage.setItem(config.user, data.user);
  if (data.photo) localStorage.setItem(config.userPhoto, data.photo);
  if (data.state) localStorage.setItem(config.userState, data.state);
};
