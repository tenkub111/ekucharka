const API_URL = "http://localhost:3030";

async function loadCategories() {
    try {
        const res = await fetch(`${API_URL}/category/list`);
        const categories = await res.json();

        // Seřazení kategorií podle názvu (abecedně)
        categories.sort((a, b) => a.name.localeCompare(b.name));

        const filterSelect = document.getElementById("filter-category");
        const recipeSelect = document.getElementById("recipe-category");

        if (filterSelect) filterSelect.innerHTML = '<option value="">Všechny kategorie</option>';
        if (recipeSelect) recipeSelect.innerHTML = '';

        categories.forEach(cat => {
            const option = new Option(cat.name, cat.id);
            if (filterSelect) filterSelect.appendChild(option.cloneNode(true));
            if (recipeSelect) recipeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Chyba při načítání kategorií:", error);
        alert("Nepodařilo se načíst kategorie.");
    }
}

async function loadRecipes() {
    try {
        const categoryId = document.getElementById("filter-category")?.value;
        const onlyFavorites = document.getElementById("filter-favorite")?.checked;

        const res = await fetch(`${API_URL}/recipe/list${categoryId ? `?categoryId=${categoryId}` : ''}`);
        let recipes = await res.json();

        if (onlyFavorites) {
            recipes = recipes.filter(recipe => recipe.isFavorite);
        }

        // Řazení podle hodnocení (sestupně)
        recipes.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

        const list =
            document.getElementById("recipe-edit-list") ||
            document.getElementById("recipe-list");

        if (!list) return;

        list.innerHTML = "";

        recipes.forEach(recipe => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${recipe.name}</strong> (${recipe.rating ?? "–"}⭐)<br>
                <small>${recipe.ingredients.join(", ")}</small><br>
                <p>${recipe.instructions}</p>
            `;

            if (list.id === "recipe-edit-list") {
                const editBtn = document.createElement("button");
                editBtn.textContent = "✏️ Upravit";
                editBtn.onclick = () => editRecipe(recipe);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "🗑️ Smazat";
                deleteBtn.onclick = () => deleteRecipe(recipe.id);

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
            }

            list.appendChild(li);
        });
    } catch (error) {
        console.error("Chyba při načítání receptů:", error);
        alert("Nepodařilo se načíst recepty.");
    }
}

async function createRecipe() {
    try {
        const name = document.getElementById("recipe-name").value.trim();

        // Kontrola duplicitního názvu (při vytváření nového)
        const recipes = await fetch(`${API_URL}/recipe/list`).then(res => res.json());
        if (!window.editingRecipeId && recipes.some(r => r.name.toLowerCase() === name.toLowerCase())) {
            return alert("Recept s tímto názvem již existuje.");
        }

        // Validace hodnocení
        const rating = parseFloat(document.getElementById("recipe-rating").value);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return alert("Hodnocení musí být číslo mezi 1 a 5.");
        }

        const recipe = {
            name,
            ingredients: document.getElementById("recipe-ingredients").value.split("\n"),
            instructions: document.getElementById("recipe-instructions").value,
            categoryId: document.getElementById("recipe-category").value,
            rating: rating,
            isFavorite: document.getElementById("recipe-favorite").checked
        };

        let response;
        if (window.editingRecipeId) {
            recipe.id = window.editingRecipeId;
            response = await fetch(`${API_URL}/recipe/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recipe)
            });

            if (!response.ok) throw new Error("Chyba při úpravě receptu");

            alert("Recept byl upraven.");
            window.editingRecipeId = null;
        } else {
            response = await fetch(`${API_URL}/recipe/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recipe)
            });

            if (!response.ok) throw new Error("Chyba při vytváření receptu");

            alert("Recept byl vytvořen.");
        }

        // Vyčištění formuláře
        document.getElementById("recipe-name").value = "";
        document.getElementById("recipe-ingredients").value = "";
        document.getElementById("recipe-instructions").value = "";
        document.getElementById("recipe-category").value = "";
        document.getElementById("recipe-rating").value = "";
        document.getElementById("recipe-favorite").checked = false;

        loadRecipes();
    } catch (error) {
        console.error(error);
        alert("Nepodařilo se vytvořit nebo upravit recept.");
    }
}

window.editRecipe = function (recipe) {
    document.getElementById("recipe-name").value = recipe.name;
    document.getElementById("recipe-ingredients").value = recipe.ingredients.join("\n");
    document.getElementById("recipe-instructions").value = recipe.instructions;
    document.getElementById("recipe-category").value = recipe.categoryId;
    document.getElementById("recipe-rating").value = recipe.rating ?? "";
    document.getElementById("recipe-favorite").checked = !!recipe.isFavorite;
    window.editingRecipeId = recipe.id;
};

window.deleteRecipe = async function (id) {
    try {
        await fetch(`${API_URL}/recipe/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        alert("Recept byl smazán.");
        loadRecipes();
    } catch (error) {
        console.error(error);
        alert("Nepodařilo se smazat recept.");
    }
};

async function createCategory() {
    try {
        const name = document.getElementById("new-category").value.trim();
        if (!name) return alert("Zadejte název kategorie.");

        const categories = await fetch(`${API_URL}/category/list`).then(res => res.json());
        if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            return alert("Kategorie s tímto názvem již existuje.");
        }

        const response = await fetch(`${API_URL}/category/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!response.ok) throw new Error("Chyba při vytváření kategorie");

        alert("Kategorie vytvořena.");
        document.getElementById("new-category").value = "";
        loadCategories();
    } catch (error) {
        console.error(error);
        alert("Nepodařilo se vytvořit kategorii.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadRecipes();
});
