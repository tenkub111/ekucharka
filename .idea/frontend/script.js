const API_URL = "https://localhost:3030";

// help function
function showMessage(msg) {
    alert(msg);
}

async function fetchJson(url, options = {}) {
    const res = await fetch(url, {
        headers: {"Content-Type": "application/json" },
        ...options
    });
    return res.json();
}

// categories
async function loadCategories() {
    const categories = await fetch(`${API_URL}/category/list`);
    const categoryList = document.getElementById("category-list");
    const filter = document.getElementById("category-filter");
    const select = document.getElementById("category-select");

    categoryList.innerHTML = "";
    filter.innerHTML = "<option value=''>Všechny kategorie</option>";
    select.innerHTML = "<option disabled selected>Vyber Kategorii</option>";

    categories.forEach(category => {
        const li = document.createElement("li");
        li.textContent = category.name;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.onclick = async () => {
            await fetchJson(`${API_URL}/category/delete`, {
                method: "POST",
                body: JSON.stringify({id: category.id}),
            });
            showMessage("Kategorie smazána");
            loadCategories();
            loadRecipes();
        };
        li.appendChild(deleteButton);
        categoryList.appendChild(li);

        const option = new Option(category.name, category.id);
        filter.appendChild(option);
        select.appendChild(option.cloneNode(true));
    });
}

async function createCategory() {
    const name = document.getElementById("new-category").value.trim();
    if (!name) return showMessage("Zadejte název kategorie");
    await fetchJson(`${API_URL}/category/create`, {
        method: "POST",
        body: JSON.stringify({name})
    });
    showMessage("Kategorie přidána");
    document.getElementById("new-category").value = "";
    loadCategories();
}

// recipes
async function loadRecipes() {
    const categoryId = document.getElementById("filter-category").value;
    const params = categoryId ? `?categoryId=${categoryId}` : "";
    const recipes = await fetch(`${API_URL}/recipe/list${params}`);
    const list = document.getElementById("recipe-list");
    list.innerHTML = "";

    recipes.forEach(recipe => {
        const li = document.createElement("li");
        li.innerHTML = `
        <h3>${recipe.name} ${recipe.isFavorite ? "⭐" : ""}</h3>
        <p><strong>Ingredience:</strong><br>${(recipe.ingredients || []).join("<br>")}</p>
        <p><strong>Postup:</strong> ${recipe.instructions}</p>
        <p><strong>Hodnocení:</strong> ${recipe.rating || "není"}</p>
        `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Smazat";
        deleteButton.onclick = async () => {
            await fetchJson(`${API_URL}/recipe/delete`, {
                method: "POST",
                body: JSON.stringify({id: recipe.id}),
            });
            showMessage("Recept smazán");
            loadRecipes();
        }

        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = recipe.isFavorite ? "Odebrat z oblíbených" : "Přidat k oblíbeným";
        favoriteButton.onclick = async () => {
            await fetchJson(`${API_URL}/recipe/favorite`, {
                method: "POST",
                body: JSON.stringify({id: recipe.id, isFavorite: !recipe.isFavorite}),
            })
            loadRecipes();
        };

        const rateInput = document.createElement("input");
        rateInput.type = "number";
        rateInput.min = 1;
        rateInput.max = 5;
        rateInput.placeholder = "1-5";
        const rateButton = document.createElement("button");
        rateButton.textContent = "Ohodnotit";
        rateButton.onclick = async () => {
            const rating = Number(rateInput.value);
            if (rating >= 1 && rating <= 5) {
                await fetchJson(`${API_URL}/recipe/rating`, {
                    method: "POST",
                    body: JSON.stringify({id: recipe.id, rating}),
                });
                showMessage("Hodnocení uloženo");
                loadRecipes();
            } else {
                showMessage("Zadejte číslo mezi 1-5");
            }
        };

        const editButton = document.createElement("button");
        editButton.textContent = "Upravit";
        editButton.onclick = () => {
            document.getElementById("recipe-name").value = recipe.name;
            document.getElementById("recipe-ingredients").value = recipe.ingredients.join("\n");
            document.getElementById("recipe-description").value = recipe.description;
            document.getElementById("recipe-category").value = recipe.categoryId;
            document.getElementById("recipe-rating").value = recipe.rating || "";
            document.getElementById("recipe-favorite").checked = !!recipe.isFavorite;
            document.getElementById("add-recipe-section").dataset.editingId = recipe.id;
            showMessage("Formulář předvyplněn k úpravě");
        };

        li.append(deleteButton, favoriteButton, rateInput, rateButton, editButton);
        list.appendChild(li);
    });
}

async function createRecipe() {
    const id = document.getElementById("add-recipe-section").dataset.editingId;
    const name = document.getElementById("recipe-name").value.trim();
    const ingredients = document.getElementById("recipe-ingredients").value.split("\n").map(i => i.trim().filter(i => i));
    const instructions = document.getElementById("recipe-instructions").value.trim();
    const categoryId = document.getElementById("recipe-category").value;
    const rating = Number(document.getElementById("recipe-rating").value);
    const isFavorite = document.getElementById("recipe-favorite").checked;

    const payload = {
        name,
        ingredients,
        instructions,
        categoryId,
        ...(rating ? {rating} : {}),
        isFavorite,
    }

    if (id) {
        payload.id = id;
        await fetchJson(`${API_URL}/recipe/update`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        showMessage("Recept upraven");
        document.getElementById("add.recipe-section").dataset.editingId = "";
    } else {
        await fetchJson(`${API_URL}/recipe/create`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        showMessage("Recept přidán");
    }

    document.getElementById("recipe-name").value = "";
    document.getElementById("recipe-ingredients").value = "";
    document.getElementById("recipe-description").value = "";
    document.getElementById("recipe-category").selectedIndex = 0;
    document.getElementById("recipe-rating").value = "";
    document.getElementById("recipe-favorite").checked = false;

    loadRecipes();
}

window.onload = () => {
    loadCategories();
    loadRecipes();
};