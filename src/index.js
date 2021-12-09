const express = require("express");

const postController = require("./controllers/auth.controller");

const Product = require("../src/models/user.model");

const productController = require("./controllers/product.controller");



const app = express();

app.use(express.json());

// app.use("/users", userController) // /register /login
// app.post("/register", register);
// app.post("/login", login);


app.use("/users", postController);
// app.use("/login", login);

app.use("/posts", productController);

module.exports = app;
