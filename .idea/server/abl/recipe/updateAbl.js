const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" },
        ingredients: {
            type: "array",
            items: { type: "string" }
        },
        instructions: { type: "string" },
        categoryId: { type: "string" },
        rating: { type: "number" },
        isFavorite: { type: "boolean" }
    },
    required: ["id", "name", "categoryId"],
    additionalProperties: false
};


async function UpdateAbl(req, res) {
    try {
        const recipe = req.body;

        const valid = ajv.validate(schema, recipe);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "Input is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const existing = recipeDao.get(recipe.id);
        if (!existing) {
            res.status(404).json({ code: "recipeNotFound", message: "Recipe not found" });
            return;
        }

        const updatedRecipe = recipeDao.update(recipe);
        res.json(updatedRecipe);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = UpdateAbl;
