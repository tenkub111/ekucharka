const API_URL = "http://localhost:3030";

async function loadRecipes() {
    const res = await fetch(`${API_URL}/recipe/list`);
    const recipes = await res.json();
    const list = document.getElementById("recipe-list");
    list.innerHTML = "";
    recipes.forEach(rec => {
        const li = document.createElement("li");
        li.innerHTML = `
      <strong>${rec.name}</strong><br>
      ⭐ Hodnocení: ${rec.rating ?? "–"}<br>
      <em>${rec.ingredients?.join(", ")}</em><br>
      <p>${rec.instructions}</p>
      <button onclick="deleteRecipe('${rec.id}')">Smazat</button>
    `;
        list.appendChild(li);
    });
}

async function deleteRecipe(id) {
    await fetch(`${API_URL}/recipe/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
    loadRecipes();
}

loadRecipes();
