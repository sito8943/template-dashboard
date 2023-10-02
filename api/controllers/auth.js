// @ts-check
var CryptoJS = require("crypto-js");

const { select, update, insert, deleteDocuments } = require("sito-node-mysql");

const config = require("../config");

/**
 *
 * @param {boolean} remember
 * @returns
 */
const giveToken = (remember) => {
  return remember ? 30 : 1;
};

/**
 *
 * @param {string} user
 * @param {string} ip
 */
const signOut = async (user, ip) => {
  const { rows } = await select("users", ["id"], {
    attribute: "user",
    operator: "=",
    value: user,
  });
  const [userData] = rows;
  if (userData) {
    await insert("logs", ["id", "idUser", "operation", "date", "observation"], {
      idUser: userData.id,
      operation: "sign-out",
      date: String(new Date().getTime()),
      observation: "sign out",
    });
    await update(
      "users",
      ["status"],
      { status: 0 },
      { attribute: "id", operator: "=", value: userData.id }
    );
    await deleteDocuments("tokens", {
      attribute: "idUser",
      operator: "=",
      value: userData.id,
    });
    return {
      status: 200,
      data: {
        message: "logged out",
      },
    };
  }
  return {
    status: 422,
    data: {
      error: "not found",
    },
  };
};

/**
 *
 * @param {string} user
 * @param {string} password
 * @param {boolean} remember
 * @param {string}ip
 * @returns user data
 */
const login = async (user, password, remember, ip) => {
  const { rows } = await select(
    "users",
    ["id", "pw", "user", "photo", "state", "userType"],
    [
      { attribute: "user", operator: "=", value: user },
      { attribute: "email", operator: "=", value: user, logic: "OR" },
    ]
  );
  const [data] = rows;

  if (data !== undefined) {
    // validating if is already logged
    const tokensResponse = await select("tokens", ["idUser"], {
      attribute: "idUser",
      operator: "=",
      value: data.id,
    });
    if (tokensResponse.rows.length)
      await deleteDocuments("tokens", {
        attribute: "idUser",
        operator: "=",
        value: data.id,
      });
    // @ts-ignore
    if (data.pw.toLowerCase() === password.toLowerCase()) {
      // loading permissions
      const permissionTypesResponse = await select(
        ["permissions", "rolespermissions"],
        ["operation"],
        [
          {
            attribute: "permissions.id",
            operator: "=",
            value: "rolespermissions.idPermission",
          },
          {
            attribute: "rolespermissions.idRole",
            operator: "=",
            value: data.userType,
            logic: "AND",
          },
        ]
      );
      const permissionTypes = permissionTypesResponse.rows.map(
        (permission) => permission.operation
      );
      // token
      const expiration = giveToken(remember);
      const token =
        /* It's encrypting the token */
        CryptoJS.AES.encrypt(
          `${user}[!]${data.id}[!]${ip}`,
          config.crypto || ""
        ).toString();

      await update(
        "users",
        ["status"],
        { status: 1 },
        { attribute: "id", operator: "=", value: data.id }
      );
      await insert(
        "logs",
        ["id", "idUser", "operation", "date", "observation"],
        {
          idUser: data.id,
          operation: "sign-in",
          date: String(new Date().getTime()),
          observation: "sign out",
        }
      );
      const startDate = new Date();
      const endDate = startDate;
      endDate.setDate(startDate.getDate() + expiration);
      await insert("tokens", ["id", "idUser", "start", "end", "token"], {
        idUser: data.id,
        start: startDate.getTime(),
        end: endDate.getTime(),
        token,
      });
      const { id, photo } = data;
      return {
        status: 200,
        data: {
          id,
          user: data.user,
          state: data.state,
          photo,
          token,
          expiration,
          permissions: permissionTypes,
        },
      };
    } else return { status: 401, data: { error: "wrong password" } };
  }
  return { status: 401, data: { error: "wrong password" } };
};

/**
 *
 * @param {string} user
 * @returns user data
 */
const validateUser = async (user) => {
  const { rows } = await select(
    "users",
    ["id", "user"],
    [
      { attribute: "user", operator: "=", value: user },
      { attribute: "email", operator: "=", value: user, logic: "OR" },
    ]
  );
  const [data] = rows;
  if (data !== undefined) return data.user;
  return false;
};

module.exports = {
  signOut,
  login,
  validateUser,
};
