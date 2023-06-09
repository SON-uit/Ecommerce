const dotenv = require("dotenv");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const AppError = require("./utils/appError");
dotenv.config({ path: "./.env" });
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.v3lc1v9.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB connection successfully");
  });
const app = express();
const port = 3000;

//Route file
const userRouter = require("./routes/authRouters");
const productRouter = require("./routes/productRouters");
const videoRouter = require("./routes/videoRouters");
//Midelware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//ROUTE
app.use("/", (req, res, next) => {
  return res.status(200).json("Ecommerce App");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/videos", videoRouter);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can not find this url ${req.originalUrl}`, 404);
  console.log(err);
  next(err);
});

const server = app.listen(port, () =>
  console.log(`Example app listening on ${port} port !`)
);
