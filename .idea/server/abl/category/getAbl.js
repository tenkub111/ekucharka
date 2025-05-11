const Ajv = require("ajv");
const ajv = new Ajv();

const categoryDao = require("../../dao/category-dao.js");

const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
};

async function GetAbl(req, res) {
    try {
        const reqParams = req.query?.id ? req.query : req.body;

        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const category = categoryDao.get(reqParams.id);
        if (!category) {
            res.status(404).json({
                code: "categoryNotFound",
                message: `Category with id ${reqParams.id} not found`,
            });
            return;
        }

        res.json(category);
    } catch (e) {
        res.status(500).json({ category: e.message });
    }
}

module.exports = GetAbl;
