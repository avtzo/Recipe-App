import { ingredientsList } from "./ingredients.js";

const apiKey = "478717df8fb64e79be4ee7c955781fbd"; // Your API Key Here
const myIngredients = JSON.parse(localStorage.getItem("myIngredients")) || [];

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
    const recipesByIngredientUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${cleanIngredients}&number=6`;
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

getData("randomSearch");

randomRecipesBtn.addEventListener("click", () => {
    menuScreen.classList.add("hidden");
    recipesScreen.classList.remove("hidden");
});

searchByIngredientsBtn.addEventListener("click", () => {
    menuScreen.classList.add("hidden");
    myIngredientsScreen.classList.remove("hidden");
});

backToMenuBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        menuScreen.classList.remove("hidden");
        recipesScreen.classList.add("hidden");
        myIngredientsScreen.classList.add("hidden");
    });
});

confirmIngredientsBtn.addEventListener("click", () => {    
    myIngredientsScreen.classList.add("hidden");
    recipesScreen.classList.remove("hidden");
});