# 🍳 Find Your Recipe App

A modern, responsive Single Page Application (SPA) built with Vanilla JavaScript, HTML5, and CSS3. The app allows users to discover recipes randomly, search recipes based on ingredients they currently have, and bookmark their favorite recipes using local storage.

![JS Badge](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat&logo=javascript)
![HTML5 Badge](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

---

## ✨ Features

- **🎲 Random Recipe Discovery:** Fetch and browse random dishes instantly.
- **🥑 Search by Ingredients:** Choose available ingredients from an interactive grid to fetch matching recipes.
- **🔖 Saved Recipes (Bookmarks):** Save favorite recipes locally (`localStorage`) for quick access anytime.
- **🎨 Glassmorphism UI:** Clean, ultra-modern aesthetic with dynamic gradient backgrounds and blur effects.
- **⚡ Skeleton Loaders:** Smooth loading animations for enhanced user experience during API fetches.
- **📱 Fully Responsive:** Adaptive CSS Grid layout tailored for desktop, tablet, and mobile screens.
- **🛡️ Error Handling:** Friendly custom error screens for network/API fetch issues.

---

## 🛠️ Tech Stack & Concepts

- **Frontend:** HTML5, CSS3 (Glassmorphism, CSS Grid, Flexbox, Keyframe Animations)
- **JavaScript:** ES6+ Modules, Dynamic DOM Manipulation, Event Delegation, `async/await`, Fetch API
- **State & Storage:** Web Storage API (`localStorage`)
- **API:** Integrates with the [Spoonacular API](https://spoonacular.com/food-api) (includes Mock Data mode for development/testing)
- **Icons:** [FontAwesome](https://fontawesome.com/)

---

📂 Project Structure
```text
├── index.html            # Main HTML layout & screen containers
├── style.css             # Glassmorphism styling, CSS Grid, and responsive queries
├── script.js            # Main application logic, API fetchers, and event listeners
├── ingredients.js       # Exported array of available ingredients metadata
├── mock_recipes.json    # Local JSON data for offline development/testing
└── images/              # Ingredient icons and error screen assets
```

---

## 🚀 Getting Started

### Prerequisites

You need a web browser and an API key from Spoonacular (optional if using `USE_MOCK = true`).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avtzo/Recipe-App.git
   ```
2. **Configure API Key (Optional):**
    Open script.js.
   
    Set USE_MOCK = false.
   
    Add your Spoonacular API key:
      `const apiKey = "YOUR_SPOONACULAR_API_KEY";`
4. **Run the App:**
   
    Open index.html directly in your browser, or run it via VS Code's Live Server extension.

