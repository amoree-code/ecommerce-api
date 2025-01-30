const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const Jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });

    const sevedUser = await user.save();
    res.status(201).json(sevedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials");

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginPassword = hashPassword.toString(CryptoJS.enc.Utf8);

    OriginPassword !== req.body.password &&
      res.status(401).json("Wrong credentials");

    const accessToken = Jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
