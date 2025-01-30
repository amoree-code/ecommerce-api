const router = require("express").Router();
const User = require("../models/User");
const {
  verifytoken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.id);
    res.status(200).json("User deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET USER
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET All USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find(req.params.id);
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
