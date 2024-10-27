const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  //処理が終わったら次の処理に行くのがnext
  const token = req.headers.authorization?.split(" ")[1]; //Bearerを取り除く
  if (!token) {
    return res.status(401).json({ message: "トークンがない" }); //401は認証エラー
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "トークンが違う" }); //403は権限エラー
    }
    req.userId = decoded.id; //req.userIdは自分で定義できる
    next();
  });
}
module.exports = isAuthenticated;
