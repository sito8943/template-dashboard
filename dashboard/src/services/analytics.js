import { getCookie } from "some-javascript-utils/browser";

// auth
import { getAuth } from "../auth/auth";

// utils
import { encrypt } from "../utils/crypto";

// config
import config from "../config";

export async function fetchEvents() {
  const response = await fetch(`${config.apiUrl}analytics/list`, {
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
 * @param {number} day
 * @param {string[]} events
 * @returns
 */
export async function fetchTriggers(year, month, day, date, events) {
  const encrypted = encrypt({ events }, config.crypto);
  const response = await fetch(
    `${config.apiUrl}analytics/fetch?params=${encodeURIComponent(
      encrypted
    )}&year=${year}&month=${month}&day=${day}&date=${date}`,
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
