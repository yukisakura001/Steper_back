// ここに認証に関するAPIを書いていきます

const router = require("express").Router(); //ルーター分けるための記述
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //ハッシュ化するためのライブラリ
const jwt = require("jsonwebtoken"); //トークンを生成するためのライブラリ
const nodemailer = require("nodemailer");
const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成
const crypto = require("crypto");

//新規ユーザー登録API
//router.post("/register", async (req, res) => {
//  const { username, email, password } = req.body; //json形式で受け取る
//
//  const hashedPassword = await bcrypt.hashSync(password, 10); //10はハッシュ化の強度
//
//  const user = await prisma.user.create({
//    //レスポンスまで待つためにawaitをつける
//    //userはテーブル名
//    data: {
//      email,
//      password: hashedPassword,
//    },
//  });
//  return res.json({ user }); //json形式で返す
//});
//仮ユーザー登録API
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      res.status(400).json({ error: "既に登録されているメールアドレスです" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  const hashedPassword = await bcrypt.hashSync(password, 10);
  //認証コード作成
  const authCode = crypto.randomUUID();
  //認証URL作成
  const authUrl = `${process.env.VERIFICATION_BASE_URL}${authCode}`;

  //期限切れ設定
  const now = new Date();

  // 24時間後のミリ秒を計算
  const twentyFourHoursLaterMillis = now.getTime() + 24 * 60 * 60 * 1000;

  // 24時間後の日時オブジェクトを作成
  const expiresAt = new Date(twentyFourHoursLaterMillis);

  //認証メール送信
  //メール送信
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "認証コード",
    text: `${authUrl}\nにアクセスして認証してください。`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: "メール送信失敗" });
    }
  });

  const user = await prisma.tempUser.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      expiresAt: expiresAt,
      verificationToken: authCode,
    },
    create: {
      email: email,
      password: hashedPassword,
      expiresAt: expiresAt,
      verificationToken: authCode,
    },
  });
  if (!user) {
    return res.status(500).json({ error: "登録失敗" });
  }

  return res.json({ user });
});

//認証API
router.post("/check", async (req, res) => {
  const { verificationToken } = req.body;

  const user = await prisma.tempUser.findUnique({
    where: { verificationToken },
  });
  if (!user) {
    return res.status(401).json({ error: "認証失敗" });
  }
  await prisma.user.upsert({
    where: { email: user.email },
    update: {
      password: user.password,
      // Update other fields as needed
    },
    create: {
      email: user.email,
      password: user.password,
      // Add other fields required for creation
    },
  });
  await prisma.tempUser.delete({
    where: { email: user.email },
  });
  res.status(200).json({ message: "認証成功" });
});

//ログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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
