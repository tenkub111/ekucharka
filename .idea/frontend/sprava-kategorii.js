const API_URL = "http://localhost:3030";

async function loadCategories() {
    try {
        const res = await fetch(`${API_URL}/category/list`);
        const categories = await res.json();

        // 🔠 Seřazení kategorií podle názvu
        categories.sort((a, b) => a.name.localeCompare(b.name));

        const list = document.getElementById("category-list");
        list.innerHTML = "";

        categories.forEach(cat => {
            const li = document.createElement("li");

            const input = document.createElement("input");
            input.type = "text";
            input.value = cat.name;
            input.id = `category-input-${cat.id}`;

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "💾 Uložit";
            saveBtn.onclick = () => updateCategory(cat.id);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️ Smazat";
            deleteBtn.onclick = () => deleteCategory(cat.id);

            li.appendChild(input);
            li.appendChild(saveBtn);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Chyba při načítání kategorií:", error);
        alert("Nepodařilo se načíst kategorie.");
    }
}



async function createCategory() {
    const name = document.getElementById("new-category").value.trim();
    if (!name) return alert("Zadejte název nové kategorie.");

    try {
        const res = await fetch(`${API_URL}/category/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (!res.ok) throw new Error("Chyba při vytváření kategorie");

        document.getElementById("new-category").value = "";
        loadCategories();
    } catch (error) {
        console.error(error);
        alert("Nepodařilo se vytvořit kategorii.");
    }
}

async function updateCategory(id) {
    const newName = document.getElementById(`category-input-${id}`).value.trim();
    if (!newName) return alert("Zadejte nový název.");

    try {
        const res = await fetch(`${API_URL}/category/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, name: newName })
        });

        if (!res.ok) throw new Error("Chyba při aktualizaci kategorie");

        alert("Kategorie byla upravena.");
        loadCategories();
    } catch (error) {
        console.error(error);
        alert("Nepodařilo se upravit kategorii.");
    }
}

async function deleteCategory(id) {
    if (!confirm("Opravdu chcete smazat tuto kategorii?")) return;

    try {
        const res = await fetch(`${API_URL}/category/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        if (!res.ok) throw new Error("Chyba při mazání kategorie");

        alert("Kategorie byla smazána.");
        loadCategories();
    } catch (error) {
        console.error(error);
        alert("Nepodařilo se smazat kategorii.");
    }
}

document.addEventListener("DOMContentLoaded", loadCategories);
