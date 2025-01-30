const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifytoken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findOneAndDelete(req.params.id);
    res.status(200).json("Product deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const prosuct = await Product.findById(req.params.id);
    res.status(200).json(prosuct);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET All PRODUCTS
router.get("/", async (req, res) => {
  const Qnew = req.query.new;
  const Qcategory = req.query.category;

  try {
    let prosucts;

    if (Qnew) {
      prosucts = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (Qcategory) {
      prosucts = await Product.find({
        categories: {
          $in: [Qcategory],
        },
      });
    } else {
      prosucts = await Product.find();
    }

    res.status(200).json(prosucts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
