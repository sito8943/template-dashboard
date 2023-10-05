import { getCookie } from "some-javascript-utils/browser";

// auth
import { getAuth } from "../auth/auth";

// utils
import { getUserName } from "../utils/auth";

// config
import config from "../config";

export const fetchNotifications = async () => {
  const response = await fetch(
    // @ts-ignore
    `${config.apiUrl}users/notifications?user=${getUserName()}`,
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  return response;
};
