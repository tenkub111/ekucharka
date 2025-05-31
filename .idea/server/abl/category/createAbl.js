const Ajv = require("ajv");
const ajv = new Ajv();
const categoryDao = require("../../dao/category-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" }
    },
    required: ["name"],
    additionalProperties: false
};

async function CreateAbl(req, res) {
    try {
        const category = req.body;

        const valid = ajv.validate(schema, category);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "Input is not valid",
                validationError: ajv.errors
            });
            return;
        }

        const existing = categoryDao.list().find(c => c.name.toLowerCase() === category.name.toLowerCase());
        if (existing) {
            res.status(400).json({ code: "duplicateCategory", message: "Kategorie s tímto názvem již existuje." });
            return;
        }

        const createdCategory = categoryDao.create(category);
        res.json(createdCategory);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateAbl;
