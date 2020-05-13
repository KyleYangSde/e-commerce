const express = require("express");
const mongoose = require("mongoose");
// import router
const authRoute = require("./routes/auth");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

// 允许使用env变量
require("dotenv").config();

// app
const app = express();

// db
// 第二个参数：configuration option
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(
    // connect完成，得到promise
    () => {
      console.log("database connected");
    }
  );

// middleware
app.use(morgan("dev"));
// 从请求body里得到json data
app.use(bodyParser.json());
// 保存用户信息在cookies
app.use(cookieParser());
// express-validator
app.use(expressValidator());
// url的前缀是api, router里的是在api之后了，
app.use("/api", authRoute);

// 通过process访问env文件里的port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * package.json
 * scripts里的命令规定直接运行的指令
 */
