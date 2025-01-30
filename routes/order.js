const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifytoken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// CREATE ORDER
router.post("/", verifytoken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete(req.params.id);
    res.status(200).json("Order deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ORDER
router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const Orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(Orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL ORDER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
