const express = require("express");
const path = require("path");

const app = express();
const port = 3030;

// Controllers
const categoryController = require("./controller/categoryController");
const recipeController = require("./controller/recipeController");

// Middlewary
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

// Testovací endpoint
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// API routes
app.use("/category", categoryController);
app.use("/recipe", recipeController);

// Start serveru
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
