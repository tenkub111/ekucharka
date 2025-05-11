const Ajv = require("ajv");
const ajv = new Ajv();
const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
        rating: { type: "number", minimum: 1, maximum: 5 }
    },
    required: ["id", "rating"],
    additionalProperties: false,
};

async function RateAbl(req, res) {
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

        recipe.rating = input.rating;
        recipeDao.update(recipe);

        res.json(recipe);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = RateAbl;
