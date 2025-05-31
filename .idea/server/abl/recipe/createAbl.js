const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        ingredients: { type: "array", items: { type: "string" } },
        instructions: { type: "string" },
        categoryId: { type: "string" },
        rating: { type: "number" },
        isFavorite: { type: "boolean" }
    },
    required: ["name", "ingredients", "instructions", "categoryId"],
    additionalProperties: false
};

async function CreateAbl(req, res) {
    try {
        const recipe = req.body;

        const valid = ajv.validate(schema, recipe);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "Input is not valid",
                validationError: ajv.errors
            });
            return;
        }

        const existing = recipeDao.list().find(r => r.name.toLowerCase() === recipe.name.toLowerCase());
        if (existing) {
            res.status(400).json({ code: "duplicateRecipe", message: "Recept s tímto názvem již existuje." });
            return;
        }

        const createdRecipe = recipeDao.create(recipe);
        res.json(createdRecipe);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateAbl;
