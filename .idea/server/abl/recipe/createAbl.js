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
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let recipe = req.body;

        const valid = ajv.validate(schema, recipe);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        try {
            recipe = recipeDao.create(recipe);
        } catch (e) {
            res.status(400).json({ ...e });
            return;
        }

        res.json(recipe);
    } catch (e) {
        res.status(500).json({ recipe: e.message });
    }
}

module.exports = CreateAbl;
