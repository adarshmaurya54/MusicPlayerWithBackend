const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token expire, Please login!!" });
  }

  try {
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if(err){
          return res.status(401).send({
              success: false,
              message: "auth failed auth"
          })
      }else{
          req.body.userId = decode.id;
          next();
      }
  })
  } catch (error) {
    return res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;
