import { ingredientsList } from "./ingredients.js";
const USE_MOCK = true; // Set to True for testing without using the API.

const apiKey = ""; // Your API Key Here
const myIngredients = JSON.parse(localStorage.getItem("myIngredients")) || [];
const savedRecipes = JSON.parse(localStorage.getItem("mySavedRecipes"));
const mySavedRecipes = Array.isArray(savedRecipes) ? savedRecipes : [];

const randomRecipesBtn = document.getElementById("random-recipes-btn");
const searchByIngredientsBtn = document.getElementById("search-by-ingredient-btn");
const editIngredientsBtn = document.getElementById("edit-ingredients-btn");
const confirmAddRemoveIngredientBtn = document.getElementById("add-remove-ingredients-btn");
const confirmIngredientsBtn = document.getElementById("confirm-ingredients-btn");
const backToMenuBtn = document.querySelectorAll(".back-to-menu-btn");
const savedRecipesBtn = document.getElementById("saved-recipes-btn");

// End of Buttons

const menuScreen = document.querySelector(".menu-screen");
const myIngredientsScreen = document.querySelector(".my-ingredients-screen");
const addRemoveIngredientScreen = document.querySelector(".add-remove-ingredients-screen");
const recipesScreen = document.querySelector(".recipes-screen");
const errorScreen = document.querySelector(".error-screen");

// End of Screens

const ingredientsContainer = document.querySelector(".ingredients-container");
const currentIngredientsDisplay = document.querySelector(".my-ingredients-display");
const recipesContainer = document.querySelector(".recipes-container");
const ingredientsOptions = document.querySelector(".ingredients-options");

// End of Elements

async function getData(type, ingredients = []) {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch("./mock_recipes.json");
        const data = await response.json();
        return data;
    } // For mock Mode

    const randomRecipesUrl = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=6`;

    try {
        let response = "";
        
        if (type === "randomSearch") {
            response = await fetch(randomRecipesUrl);
        }

        if (type === "ingredientSearch") {                        
            const cleanIngredients = Array.isArray(ingredients) 
            ? ingredients.map(id => ingredientsList.find(item => item.id === Number(id))?.name).filter(Boolean).join(",")
            : "";
            const recipesByIngredientUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${cleanIngredients}&number=6`;
            response = await fetch(recipesByIngredientUrl);
        }
        
        if (type === "savedSearch") {
            if (mySavedRecipes.length === 0) return [];
            const savedRecipesIds = mySavedRecipes.join(",");
            const bulkRecipesUrl = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${apiKey}&ids=${savedRecipesIds}`;
            response = await fetch(bulkRecipesUrl);
        }

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch(error) {
        console.error(`Error: ${error.message}`);
    }
}

function createRecipeContainer(recipe) {
    const container = document.createElement("div");
    container.classList.add(`recipe-box`);
    container.setAttribute("data-recipe-id", recipe.id);
    let iconType = mySavedRecipes.includes(recipe.id) ? "solid" : "regular"; // Changes Between filled and unfilled bookmark icon
    
    container.innerHTML = 
    `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h1 class="recipe-name">${recipe.title}</h1>
        <p class="ready-time">Ready In: <span>${recipe.readyInMinutes ? recipe.readyInMinutes + " mins" : "N/A"}</span></p>
        <button type="button" class="save-recipe-btn"><i class="fa-${iconType} fa-bookmark"></i></button>    
        `;
    return container;
}

async function displayRandomRecipes() {
    renderSkeletons(); // Skeleton Loader

    const data = await getData("randomSearch");

    if (!data) {
        errorScreen.classList.remove("hidden");
        recipesScreen.classList.add("hidden");
        return;
    }

    recipesContainer.innerHTML = "";

    const recipes = data?.recipes || [];
    
    recipes.forEach((recipe) => {
        recipesContainer.appendChild(createRecipeContainer(recipe));
    });
}

async function searchRecipesByIngredients() {
    renderSkeletons(); // Skeleton Loader
    
    const data = await getData("ingredientSearch", myIngredients);

    if (!data) {
        errorScreen.classList.remove("hidden");
        recipesScreen.classList.add("hidden");
        return;
    }

    recipesContainer.innerHTML = "";

    const recipes = Array.isArray(data) ? data : []; 
    
    recipes.forEach((recipe) => {
        recipesContainer.appendChild(createRecipeContainer(recipe));
    });
}

async function showSavedRecipes() {    
    renderSkeletons(); // Skeleton Loader
    
    if (mySavedRecipes.length === 0) {
        recipesContainer.innerHTML = `<p id="no-saved-recipes-msg">You don't have any saved recipes yet!</p>`;
        return;
    }
    const data = await getData("savedSearch");

    if (!data) {
        errorScreen.classList.remove("hidden");
        recipesScreen.classList.add("hidden");
        return;
    }
    
    recipesContainer.innerHTML = "";
    const recipes = Array.isArray(data) ? data : []; // Checks if data is an Array and if not it uses an empty Array

    recipes.forEach((recipe) => {
        recipesContainer.appendChild(createRecipeContainer(recipe));
    });
}

function renderIngredients(type, ingredientIds) {
    ingredientIds.forEach((ingredientId) => {
        const ingredient = ingredientsList.find(
            (ingredient) => ingredient.id === Number(ingredientId) // Takes the ingredient ID and returns the full ingredient object
        );
        if (!ingredient) return;

        const container = document.createElement("div");
        container.classList.add("ingredient-box");
        container.innerHTML =
        `
            <img src="images/ingredients/${ingredient.image}" alt="${ingredient.name}">
            <h1 class="ingredient-name">${ingredient.displayName}</h1>
        `;
        container.setAttribute("data-id", ingredient.id);
        if (type === "myIngredients") {
            currentIngredientsDisplay.appendChild(container);
        }
        if (type === "allIngredients") {
            container.classList.add("all-ingredients");
            if (myIngredients.includes(ingredient.id)) {
                container.classList.add("clicked");
            }
            ingredientsContainer.appendChild(container);
        }
    });
}

function renderSkeletons() {
    recipesContainer.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const skeletonCard = document.createElement("div");
        skeletonCard.classList.add("recipe-box");
        skeletonCard.innerHTML = 
        `
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
        `;
        recipesContainer.appendChild(skeletonCard);
    }
}

document.addEventListener("click", (e) => {
    const ingredientBox = e.target.closest(".all-ingredients");
    const saveRecipeBtn = e.target.closest(".save-recipe-btn");
    
    if (ingredientBox) {
        ingredientBox.classList.toggle("clicked");
    }
    
    if (saveRecipeBtn) {
        const recipeCard = saveRecipeBtn.closest(".recipe-box");
        const recipeId = Number(recipeCard.dataset.recipeId);
        const bookmarkIcon = saveRecipeBtn.querySelector("i");

        const index = mySavedRecipes.indexOf(recipeId);

        if (index === -1) {
            mySavedRecipes.push(recipeId);
            bookmarkIcon.className = "fa-solid fa-bookmark";
        } else {
            mySavedRecipes.splice(index, 1);
            bookmarkIcon.className = "fa-regular fa-bookmark";

            if (!recipesScreen.classList.contains("hidden") && recipesContainer.children.length > 0) {
                recipeCard.remove();
                if (mySavedRecipes.length === 0) {
                    recipesContainer.innerHTML = `<p>You don't have any saved recipes yet!</p>`;
                }
            }
        }

        localStorage.setItem("mySavedRecipes", JSON.stringify(mySavedRecipes));
    }    
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !addRemoveIngredientScreen.classList.contains("hidden")) {
        confirmAddRemoveIngredientBtn.click();
    }
});

randomRecipesBtn.addEventListener("click", () => {
    menuScreen.classList.add("hidden");
    recipesScreen.classList.remove("hidden");
    displayRandomRecipes();
});

searchByIngredientsBtn.addEventListener("click", () => {
    menuScreen.classList.add("hidden");
    myIngredientsScreen.classList.remove("hidden");
    currentIngredientsDisplay.innerHTML = "";
    renderIngredients("myIngredients", myIngredients);
});

backToMenuBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        menuScreen.classList.remove("hidden");
        recipesScreen.classList.add("hidden");
        myIngredientsScreen.classList.add("hidden");
        errorScreen.classList.add("hidden");
    });
});

editIngredientsBtn.addEventListener("click", () => {
    addRemoveIngredientScreen.classList.remove("hidden");
    ingredientsContainer.innerHTML = "";
    currentIngredientsDisplay.style.display = "none";
    ingredientsOptions.style.display = "none";
    renderIngredients("allIngredients", ingredientsList.map((ingredient) => ingredient.id));
});

confirmAddRemoveIngredientBtn.addEventListener("click", () => {
    addRemoveIngredientScreen.classList.add("hidden");
    currentIngredientsDisplay.style.display = "grid";
    ingredientsOptions.style.display = "flex";
    const selectedBoxes = document.querySelectorAll(".all-ingredients.clicked");
    const selectedIds = Array.from(selectedBoxes).map(box => Number(box.dataset.id));
    
    myIngredients.length = 0;
    myIngredients.push(...selectedIds);
    
    localStorage.setItem("myIngredients", JSON.stringify(myIngredients));

    currentIngredientsDisplay.innerHTML = "";
    renderIngredients("myIngredients", selectedIds);
});

confirmIngredientsBtn.addEventListener("click", () => {
    if (myIngredients.length === 0) {
        alert("Please select at least 1 Ingredient.");
        return;
    }    
    searchRecipesByIngredients();
    myIngredientsScreen.classList.add("hidden");
    recipesScreen.classList.remove("hidden");
});

savedRecipesBtn.addEventListener("click", () => {
    menuScreen.classList.add("hidden");
    recipesScreen.classList.remove("hidden");
    showSavedRecipes();
});