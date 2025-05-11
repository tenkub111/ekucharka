const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const recipeFolderPath = path.join(__dirname, "storage", "recipeList");

function get(recipeId) {
    try {
        const filePath = path.join(recipeFolderPath, `${recipeId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadRecipe", message: error.message };
    }
}

function create(recipe) {
    try {
        recipe.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(recipeFolderPath, `${recipe.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(recipe), "utf8");
        return recipe;
    } catch (error) {
        throw { code: "failedToCreateRecipe", message: error.message };
    }
}

function update(recipe) {
    try {
        const currentRecipe = get(recipe.id);
        if (!currentRecipe) return null;
        const newRecipe = { ...currentRecipe, ...recipe };
        const filePath = path.join(recipeFolderPath, `${recipe.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(newRecipe), "utf8");
        return newRecipe;
    } catch (error) {
        throw { code: "failedToUpdateRecipe", message: error.message };
    }
}

function remove(recipeId) {
    try {
        const filePath = path.join(recipeFolderPath, `${recipeId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") return {};
        throw { code: "failedToRemoveRecipe", message: error.message };
    }
}

function list(filter = {}) {
    try {
        const files = fs.readdirSync(recipeFolderPath);
        let recipeList = files.map((file) => {
            const data = fs.readFileSync(path.join(recipeFolderPath, file), "utf8");
            return JSON.parse(data);
        });

        if (filter.categoryId) {
            recipeList = recipeList.filter(r => r.categoryId === filter.categoryId);
        }

        if (filter.favorite) {
            recipeList = recipeList.filter(r => r.favorite === true);
        }

        recipeList.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        return recipeList;
    } catch (error) {
        throw { code: "failedToListRecipes", message: error.message };
    }
}

function rate(recipeId, rating) {
    try {
        const recipe = get(recipeId);
        if (!recipe) return null;
        recipe.rating = rating;
        return update(recipe);
    } catch (error) {
        throw { code: "failedToRateRecipe", message: error.message };
    }
}

function setFavorite(recipeId, isFavorite) {
    try {
        const recipe = get(recipeId);
        if (!recipe) return null;
        recipe.favorite = isFavorite;
        return update(recipe);
    } catch (error) {
        throw { code: "failedToSetFavorite", message: error.message };
    }
}

module.exports = {
    get,
    create,
    update,
    remove,
    list,
    rate,
    setFavorite
};