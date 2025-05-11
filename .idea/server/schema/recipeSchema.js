const recipeSchema = {
    id: "a1b2c3d4e5f6", // generated unique code
    title: "Smažený sýr", // name of the recipe
    ingredients: ["sýr", "strouhanka", "vejce"], // list of ingredients
    instructions: "Obalte sýr a osmažte na pánvi.", // step-by-step instructions
    rating: 4.5, // average rating from users
    isFavorite: true, // whether the recipe is marked as favorite
    categoryId: "cat12345" // ID of the recipe category
};

module.exports = recipeSchema;