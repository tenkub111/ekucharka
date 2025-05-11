const express = require("express");
const app = express();
const port = 3030;

const transactionController = require("./controller/categoryController");
const categoryController = require("./controller/recipeController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/category", categoryController);
app.use("/recipe", recipeController);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});