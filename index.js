const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongodb Is Connected"))
  .catch((error) => "error id filled" + console.log(error));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("BackEnd Server Is Running");
});
