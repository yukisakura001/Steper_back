const router = require("express").Router(); //ルーター分けるための記述
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt"); //ハッシュ化するためのライブラリ
const jwt = require("jsonwebtoken"); //トークンを生成するためのライブラリ
const isAuthenticated = require("../middlewares/isAuthenticated"); //認証用のミドルウェア

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      //findUniqueは一つのデータを取得
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つからない" });
    }
    res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username }, //userを返すとパスワードも返してしまうので、idとemailだけ返す
    });
  } catch (e) {
    res.status(500).json({ message: "サーバーエラー" });
  }
});

module.exports = router; //routerをエクスポート
