const express = require("express");
const cors = require("cors"); //CORSを許可するためのライブラリ
const authRoute = require("./routers/auth"); //ルーターを読み込む
const usersRoute = require("./routers/users"); //ルーターを読み込む
const postRoute = require("./routers/post"); //ルーターを読み込む
require("dotenv").config(); //環境変数を使うためのライブラリ

const app = express(); // サーバー起動

const port = 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.use(express.json()); //json形式で受け取るための記述
//app.use(cors()); //CORSを許可するための記述

app.use("/api/auth", authRoute); //ルーターを読み込む（auth）
app.use("/api/users", usersRoute); //ルーターを読み込む（users）
app.use("/api/posts", postRoute); //ルーターを読み込む（post）

app.get(
  "/",
  (req, res) => res.send("<h1>Hello World!</h1>") // タグを送信
);

app.listen(port, () => console.log(`Server is running on port ${port}`)); //第二変数でサーバー起動時の処理を記述
