// @ts-check

var express = require("express");

const {
  unblockUser,
  blockUser,
  sendFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
  friendList,
  blockList,
  userList,
} = require("../../controllers/client/users");

var router = express.Router();

const { insert } = require("sito-node-mysql");
const { validator } = require("../../utils/secure");

router.post("/unblock-user", [validator], async (req, res) => {
  console.info("unblocking user");
  const { dealer, target } = req.body;
  try {
    const result = await unblockUser(dealer, target);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.post("/block-user", [validator], async (req, res) => {
  console.info("blocking user");
  const { dealer, target } = req.body;
  try {
    const result = await blockUser(dealer, target);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.get("/block-list", [validator], async (req, res) => {
  console.info("accept friend request");
  const { dealer } = req.query;

  try {
    const result = await blockList(dealer);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.post("/send-friend-request", [validator], async (req, res) => {
  console.info("send friend request");
  const { dealer, target } = req.body;
  try {
    const result = await sendFriendRequest(dealer, target);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.post("/reject-friend-request", [validator], async (req, res) => {
  console.info("reject friend request");
  const { dealer, target } = req.body;
  try {
    const result = await rejectFriendRequest(dealer, target);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.post("/cancel-friend-request", [validator], async (req, res) => {
  console.info("cancel friend request");
  const { dealer, target } = req.body;
  try {
    const result = await cancelFriendRequest(dealer, target);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.post("/accept-friend-request", [validator], async (req, res) => {
  console.info("accept friend request");
  const { dealer, target } = req.body;
  try {
    const result = await acceptFriendRequest(dealer, target);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.get("/friend-list", [validator], async (req, res) => {
  console.info("accept friend request");
  const { dealer } = req.query;
  try {
    const result = await friendList(dealer);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

router.get("/user-list", [validator], async (req, res) => {
  console.info("accept friend request");
  const { dealer } = req.query;
  try {
    const result = await userList(dealer);
    res.status(result.status).send(result.data);
  } catch (err) {
    console.error(err);
    await insert("errors", ["id", "error", "idUser", "date"], {
      error: String(err),
      idUser: dealer,
      date: new Date().getTime(),
    });
    res.status(500).send(err);
  }
});

module.exports = router;
