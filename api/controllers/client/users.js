// @ts-check

const { deleteDocuments, insert, select } = require("sito-node-mysql");

/**
 *
 * @param {string} dealer
 * @param {string} target
 */
async function unblockUser(dealer, target) {
  await deleteDocuments("blocked", [
    {
      attribute: "idDealer",
      operator: "=",
      value: dealer,
    },
    {
      attribute: "idTarget",
      operator: "=",
      value: target,
      logic: "AND",
    },
  ]);
  return {
    status: 200,
    data: {
      message: "ok",
    },
  };
}

/**
 *
 * @param {string} dealer
 * @param {string} target
 */
async function blockUser(dealer, target) {
  // removing friendship if exist
  console.info("deleting previous friendship");
  await deleteDocuments("friendships", [
    { attribute: "idDealer", operator: "=", value: dealer },
    { attribute: "idTarget", operator: "=", value: target, logic: "AND" },
    { attribute: "idDealer", operator: "=", value: target, logic: "AND" },
    { attribute: "idTarget", operator: "=", value: dealer, logic: "AND" },
  ]);
  console.info("inserting blocked");
  await insert("blocked", ["id", "idDealer", "idTarget", "date"], {
    idDealer: dealer,
    idTarget: target,
    date: String(new Date().getTime()),
  });
  return {
    status: 200,
    data: {
      message: "ok",
    },
  };
}

/**
 *
 * @param {string} user
 * @returns
 */
async function blockList(user) {
  const { rows } = await select(
    ["users", "blocked"],
    ["users.*"],
    [
      { attribute: "blocked.idDealer", operator: "=", value: user },
      {
        attribute: "blocked.idTarget",
        operator: "=",
        value: "users.id",
        logic: "AND",
      },
    ]
  );
  return {
    status: 200,
    data: {
      list: rows,
    },
  };
}

/**
 *
 * @param {string} dealer
 * @param {string} target
 */
async function sendFriendRequest(dealer, target) {
  const { rows } = await select(
    "friendrequests",
    [],
    [
      { attribute: "idUserSender", operator: "=", value: dealer },
      {
        attribute: "idUserReceiver",
        operator: "=",
        value: target,
        logic: "AND",
      },
    ]
  );
  if (rows.length)
    return {
      status: 403,
      data: {
        message: "already sent",
      },
    };
  await insert(
    "friendrequests",
    ["id", "idUserSender", "idUserReceiver", "date"],
    {
      idUserSender: dealer,
      idUserReceiver: target,
      date: String(new Date().getTime()),
    }
  );
  return {
    status: 200,
    data: {
      message: "ok",
    },
  };
}

/**
 *
 * @param {string} dealer
 * @param {string} target
 */
async function rejectFriendRequest(dealer, target) {
  await deleteDocuments("friendrequests", [
    { attribute: "idUserReceiver", operator: "=", value: dealer },
    { attribute: "idUserSender", operator: "=", value: target, logic: "AND" },
  ]);
  return {
    status: 200,
    data: {
      message: "ok",
    },
  };
}

/**
 *
 * @param {string} dealer
 * @param {string} target
 */
async function cancelFriendRequest(dealer, target) {
  await deleteDocuments("friendrequests", [
    { attribute: "idUserSender", operator: "=", value: dealer },
    { attribute: "idUserReceiver", operator: "=", value: target, logic: "AND" },
  ]);
  return {
    status: 200,
    data: {
      message: "ok",
    },
  };
}

/**
 *
 * @param {string} dealer
 * @param {string} target
 */
async function acceptFriendRequest(dealer, target) {
  await insert("friendships", ["id", "idDealer", "idTarget", "date"], {
    idDealer: dealer,
    idTarget: target,
    date: String(new Date().getTime()),
  });
  await insert("friendships", ["id", "idDealer", "idTarget", "date"], {
    idDealer: target,
    idTarget: dealer,
    date: String(new Date().getTime()),
  });
  // deleting the frind request
  await deleteDocuments("friendrequests", [
    { attribute: "idUserReceiver", operator: "=", value: dealer },
    { attribute: "idUserSender", operator: "=", value: target, logic: "AND" },
  ]);
  return {
    status: 200,
    data: {
      message: "ok",
    },
  };
}

/**
 *
 * @param {string} user
 * @returns
 */
async function friendList(user) {
  const { rows } = await select(
    ["users", "friendships"],
    ["users.*"],
    [
      { attribute: "friendships.idDealer", operator: "=", value: user },
      {
        attribute: "friendships.idTarget",
        operator: "=",
        value: "users.id",
        logic: "AND",
      },
    ]
  );
  return {
    status: 200,
    data: {
      list: rows,
    },
  };
}

/**
 *
 * @param {string} dealer
 * @returns
 */
async function userList(dealer) {
  const list = await select(
    "users",
    [],
    [{ attribute: "id", operator: "<>", value: dealer }],
    0,
    0
  );
  const { rows } = list;
  return {
    status: 200,
    data: {
      list: rows,
    },
  };
}

module.exports = {
  unblockUser,
  blockUser,
  sendFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
  userList,
  friendList,
  blockList,
};
