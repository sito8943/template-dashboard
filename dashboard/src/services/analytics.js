import { getCookie } from "some-javascript-utils/browser";

// auth
import { getAuth } from "../auth/auth";

// utils
import { encrypt } from "../utils/crypto";

// config
import config from "../config";

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {string} attribute
 * @param {string} event
 * @returns
 */
export async function pieChart(year, month, attribute, event) {
  const response = await fetch(
    `${config.apiUrl}analytics/pie-chart?year=${year}&month=${month}&attribute=${attribute}&event=${event}`,
    {
      method: "GET",
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );

  return response;
}

/**
 * 
 * @param {string} toFetch 
 * @returns 
 */
export async function fetchEvents(toFetch) {
  const response = await fetch(`${config.apiUrl}analytics/${toFetch}`, {
    method: "GET",
    headers: {
      ...getAuth,
      Authorization: `Bearer ${getCookie(config.basicKey)}`,
    },
  });

  return response;
}

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {object} params
 * @returns
 */
export async function lineChart(year, month, params) {
  const encrypted = encrypt(params, config.crypto);
  const response = await fetch(
    `${config.apiUrl}analytics/line-chart?params=${encodeURIComponent(
      encrypted
    )}&year=${year}&month=${month}`,
    {
      method: "GET",
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );

  return response;
}

/**
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {string[]} events
 * @param {boolean} attributes
 * @returns
 */
export async function barChart(year, month, events) {
  const encrypted = encrypt({ events }, config.crypto);
  const response = await fetch(
    `${config.apiUrl}analytics/bar-chart?params=${encodeURIComponent(
      encrypted
    )}&year=${year}&month=${month}`,
    {
      method: "GET",
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );

  return response;
}
