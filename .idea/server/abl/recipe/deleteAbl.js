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

        recipeDao.remove(reqParams.id);
        res.json({});
    } catch (e) {
        res.status(500).json({ recipe: e.message });
    }
}

module.exports = DeleteAbl;
