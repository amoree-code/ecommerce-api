const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifytoken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// CREATE CART
router.post("/", verifytoken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE CART
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete(req.params.id);
    res.status(200).json("Cart deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET CART
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL CART
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
