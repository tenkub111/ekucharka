const Ajv = require("ajv");
const ajv = new Ajv();

const categoryDao = require("../../dao/category-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let category = req.body;

        const valid = ajv.validate(schema, category);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        try {
            category = categoryDao.create(category);
        } catch (e) {
            res.status(400).json({ ...e });
            return;
        }

        res.json(category);
    } catch (e) {
        res.status(500).json({ category: e.message });
    }
}

module.exports = CreateAbl;
