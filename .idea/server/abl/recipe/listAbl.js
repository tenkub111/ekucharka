const Ajv = require("ajv");
const ajv = new Ajv();

const recipeDao = require("../../dao/recipe-dao.js");

const schema = {
    type: "object",
    properties: {
        categoryId: { type: "string" },
        sortBy: { type: "string", enum: ["rating", "isFavorite"] },
        sortOrder: { type: "string", enum: ["asc", "desc"] }
    },
    additionalProperties: false,
};

async function ListAbl(req, res) {
    try {
        const input = req.query;

        const valid = ajv.validate(schema, input);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "Input is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        let recipeList = recipeDao.list();

        // Filter by categoryId if provided
        if (input.categoryId) {
            recipeList = recipeList.filter(r => r.categoryId === input.categoryId);
        }

        // Sort if sortBy provided
        if (input.sortBy) {
            const sortField = input.sortBy;
            const sortOrder = input.sortOrder === "desc" ? -1 : 1;

            recipeList.sort((a, b) => {
                const aVal = a[sortField] ?? 0;
                const bVal = b[sortField] ?? 0;

                if (typeof aVal === "boolean") {
                    return (aVal === bVal) ? 0 : (aVal ? -1 : 1) * sortOrder;
                }

                return (aVal - bVal) * sortOrder;
            });
        }

        res.json(recipeList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = ListAbl;
