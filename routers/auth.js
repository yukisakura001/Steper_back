// ここに認証に関するAPIを書いていきます

const router = require("express").Router(); //ルーター分けるための記述
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //ハッシュ化するためのライブラリ
const jwt = require("jsonwebtoken"); //トークンを生成するためのライブラリ

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

//新規ユーザー登録API
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body; //json形式で受け取る

  const hashedPassword = await bcrypt.hashSync(password, 10); //10はハッシュ化の強度

  const user = await prisma.user.create({
    //レスポンスまで待つためにawaitをつける
    //userはテーブル名
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  return res.json({ user }); //json形式で返す
});

//ログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  }); //emailが一致するものを検索

  if (!user) {
    return res.status(401).json({ error: "ない" }); //401は認証エラー
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password); //パスワードが一致するか確認

  if (!isPasswordValid) {
    return res.status(401).json({ error: "パスワードミス" }); //401は認証エラー
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "4w",
  }); //トークンを生成する

  return res.json({ token }); //トークンを返すのは次の動画で
});

module.exports = router; //routerをエクスポート
