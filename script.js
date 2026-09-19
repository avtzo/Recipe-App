import { ingredientsList } from "./ingredients.js";


const apiKey = ""; // Your API Key Here
const myIngredients = JSON.parse(localStorage.getItem("myIngredients")) || [];
const mySavedRecipes = JSON.parse(localStorage.getItem("mySavedRecipes")) || [];
let ingredientsToAdd = [];

const randomRecipesBtn = document.getElementById("random-recipes-btn");
const searchByIngredientsBtn = document.getElementById("search-by-ingredient-btn");
const addIngredientBtn = document.getElementById("add-ingredient-btn");
const removeIngredientBtn = document.getElementById("remove-ingredient-btn");
const confirmAddRemoveIngredientBtn = document.getElementById("add-remove-ingredients-btn");
const confirmIngredientsBtn = document.getElementById("confirm-ingredients-btn");
const backToMenuBtn = document.querySelectorAll(".back-to-menu-btn");

// End of Buttons

const menuScreen = document.querySelector(".menu-screen");
const myIngredientsScreen = document.querySelector(".my-ingredients-screen");
const addRemoveIngredientScreen = document.querySelector(".add-remove-ingredients-screen");
const recipesScreen = document.querySelector(".recipes-screen");

// End of Screens

const ingredientsContainer = document.querySelector(".ingredients-container");
const currentIngredientsDisplay = document.querySelector(".my-ingredients-display");
const recipesContainer = document.querySelector(".recipes-container");

// End of Elements

async function getData(type, ingredients) {
    const randomRecipesUrl = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=6`;
    const cleanIngredients = ingredients ? ingredients.trim() : "";
    const recipesByIngredientUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${cleanIngredients}&number=1`;
    try {
        let response = "";
        if (type === "randomSearch") {
            response = await fetch(randomRecipesUrl);
        }
        if (type === "ingredientSearch") {
            response = await fetch(recipesByIngredientUrl);
        }
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.error(`Error: ${error.message}`);
    }
}

function createRecipeContainer(recipe) {
    const container = document.createElement("div");
    container.classList.add("recipe-box");
    container.innerHTML = 
    `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h1 class="recipe-name">${recipe.title}</h1>
        <p class="ready-time">Ready In: <span>${recipe.readyInMinutes}</span></p>
    `;
    return container;
}

async function displayRandomRecipes() {
    recipesContainer.innerHTML = "";
    const data = await getData("randomSearch");
    const recipes = data?.recipes || [];
    recipes.forEach((recipe) => {
        recipesContainer.appendChild(createRecipeContainer(recipe));
    });
}

function renderIngredients(type, ingredientIds) {
    ingredientIds.forEach((ingredientId) => {
        const ingredient = ingredientsList.find(
            (ingredient) => ingredient.id === Number(ingredientId)
        );
        if (!ingredient) return;

        const container = document.createElement("div");
        container.classList.add("ingredient-box");
        container.innerHTML =
        `
            <img src="images/ingredients/${ingredient.image}" alt="${ingredient.name}">
            <h1 class="ingredient-name">${ingredient.displayName}</h1>
        `;
        if (type === "myIngredients") {
            currentIngredientsDisplay.appendChild(container);
        }
        if (type === "allIngredients") {
            container.classList.add("all-ingredients");
            ingredientsContainer.appendChild(container);
        }
    });
}


document.addEventListener("click", (e) => {
    const ingredientBox = e.target.closest(".all-ingredients");
    if (ingredientBox) {
        ingredientBox.classList.toggle("clicked");
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
    });
});

addIngredientBtn.addEventListener("click", () => {
    addRemoveIngredientScreen.classList.remove("hidden");
    ingredientsContainer.innerHTML = "";
    renderIngredients("allIngredients", ingredientsList.map((ingredient) => ingredient.id));
});

confirmAddRemoveIngredientBtn.addEventListener("click", () => {
    addRemoveIngredientScreen.classList.add("hidden");
});

confirmIngredientsBtn.addEventListener("click", () => {    
    myIngredientsScreen.classList.add("hidden");
    recipesScreen.classList.remove("hidden");
});

