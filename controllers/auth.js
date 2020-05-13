// 得到user model
const User = require("../models/user");
// 产生json web token
const jwt = require("jsonwebtoken");
// 验证 check
const expressjwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandlers");

exports.signup = (req, res) => {
  //mongoose save()方法将req.body文档插入myCollection集合中
  const user = new User(req.body);
  console.log(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    // 不显示个人信息
    user.salt = undefined;
    user.hashed_password = undefined;

    // 返回user数据包
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email

  const { email, password } = req.body;
  console.log(req.body);
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      console.log(err, user);
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match",
      });
    }
    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

// 清除cookie
exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressjwt({
  secret: "hdfsajkfhlsdkjass",
  userProperty: "auth",
});
