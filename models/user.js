const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuidv1");

//  创建database userschema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: 32,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual field
// 给password加密
userSchema
  .virtual("password")
  .set(function (password) {
    // 构造函数构建加密后的密码
    this._password = password;
    // 给一个随机string
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// 给实例添加方法，加一个加密密码的方法
// this 指的是 userSchema
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

// 创建一个新的model 可在其他部分使用
module.exports = mongoose.model("User", userSchema);
