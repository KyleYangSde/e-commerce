const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

// 先执行userSignupValidator中间件 再signup
router.post("/signup", userSignupValidator, signup);
// 登陆
router.post("/signin", signin);
router.get("/signout", signout);
module.exports = router;
