const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/recipe/getAbl");
const ListAbl = require("../abl/recipe/listAbl");
const CreateAbl = require("../abl/recipe/createAbl");
const UpdateAbl = require("../abl/recipe/updateAbl");
const DeleteAbl = require("../abl/recipe/deleteAbl");
const RateAbl = require("../abl/recipe/rateAbl");
const FavoriteAbl = require("../abl/recipe/favoriteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);
router.post("/rate", RateAbl);           // pro hodnocení
router.post("/favorite", FavoriteAbl);   // pro označení oblíbených

module.exports = router;
