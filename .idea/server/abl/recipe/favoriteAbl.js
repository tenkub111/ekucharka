const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        isFavorite: { type: "boolean" }
    },
    required: ["id", "isFavorite"],
    additionalProperties: false,
};

async function FavoriteAbl(req, res) {
    try {
        const input = req.body;

        const valid = ajv.validate(schema, input);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "Input is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const recipe = recipeDao.get(input.id);
        if (!recipe) {
            res.status(404).json({ code: "recipeNotFound", message: "Recipe not found" });
            return;
        }

        recipe.isFavorite = input.isFavorite;
        recipeDao.update(recipe);

        res.json(recipe);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = FavoriteAbl;
