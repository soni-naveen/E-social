const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUserDetails,
  allUsers
} = require("../controllers/AuthController");

const { auth } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/getuserdetails", auth, getUserDetails);
router.get("/allusers", auth, allUsers);

module.exports = router;
