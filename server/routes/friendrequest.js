const express = require("express");
const router = express.Router();

const {
  sendRequest,
  acceptOrRejectRequest,
  getFriendRequests
} = require("../controllers/FriendRequestController");
const { auth } = require("../middlewares/auth");

router.post("/sendRequest/:receiverId", auth, sendRequest);
router.post("/:requestId/:status", auth, acceptOrRejectRequest);
router.get("/requests", auth, getFriendRequests);

module.exports = router;
