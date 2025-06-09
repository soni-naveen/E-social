const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserDetails,
  allUsers,
  deleteAccount
} = require("../controllers/AuthController");

const { auth } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/getuserdetails", auth, getUserDetails);
router.get("/allusers", auth, allUsers);
router.delete("/deleteAccount", auth, deleteAccount);

module.exports = router;
