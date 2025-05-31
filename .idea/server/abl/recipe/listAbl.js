const Ajv = require("ajv");
const ajv = new Ajv();

const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        categoryId: { type: "string" },
        sortBy: { type: "string", enum: ["rating", "isFavorite"] },
        sortOrder: { type: "string", enum: ["asc", "desc"] }
    },
    additionalProperties: false,
};

async function ListAbl(req, res) {
    try {
        const categoryId = req.query.categoryId;
        const isFavorite = req.query.isFavorite === "true";

        let recipes = recipeDao.list();

        if (categoryId) {
            recipes = recipes.filter(recipe => recipe.categoryId === categoryId);
        }

        if (req.query.isFavorite !== undefined) {
            recipes = recipes.filter(recipe => !!recipe.isFavorite === isFavorite);
        }

        res.json(recipes);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = ListAbl;
