const Ajv = require("ajv");
const ajv = new Ajv();

const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

async function DeleteAbl(req, res) {
    try {
        const reqParams = req.body;

        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const recipe = recipeDao.get(reqParams.id);
        if (!recipe) {
            res.status(404).json({ code: "recipeNotFound", message: "Recipe not found" });
            return;
        }

        recipeDao.remove(reqParams.id);
        res.json({});
    } catch (e) {
        res.status(500).json({ recipe: e.message });
    }
}

module.exports = DeleteAbl;
