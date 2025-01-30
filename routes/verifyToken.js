const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("token is not valied!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("your not authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("your not authenticated");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifytoken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("your are alowrd to the admin");
    }
  });
};

module.exports = {
  verifytoken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
