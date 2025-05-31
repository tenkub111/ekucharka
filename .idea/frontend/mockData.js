const API_URL = "http://localhost:3030";

// Mock kategorie
const categories = [
    { name: "Polévky" },
    { name: "Hlavní jídla" },
    { name: "Dezerty" }
];

// Mock recepty
const recipes = [
    {
        name: "Rajská polévka",
        ingredients: ["rajčata", "vývar", "bazalka"],
        instructions: "Povař rajčata s vývarem, dochuť bazalkou.",
        categoryId: null, // doplníme po vytvoření
        rating: 4,
        isFavorite: true
    },
    {
        name: "Smažený řízek",
        ingredients: ["vepřové", "strouhanka", "vejce"],
        instructions: "Obal maso a osmaž na pánvi.",
        categoryId: "",
        rating: 5,
        isFavorite: false
    }
];

async function loadMockData() {
    // Nejprve vytvoříme kategorie a uložíme ID
    const createdCategories = await Promise.all(
        categories.map(cat =>
            fetch(`${API_URL}/category/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cat)
            }).then(res => res.json())
        )
    );

    // Doplníme categoryId do receptů
    recipes[0].categoryId = createdCategories[0].id;
    recipes[1].categoryId = createdCategories[1].id;

    // Vytvoříme recepty
    await Promise.all(
        recipes.map(rec =>
            fetch(`${API_URL}/recipe/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rec)
            })
        )
    );

    alert("Mock data byla úspěšně nahrána.");
}

loadMockData();
