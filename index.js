import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDpziq3TzJlYk-8ej4v07BdrzB9lfyR9Vk");

document.getElementById("dataSubmitButton").addEventListener("click", getData);

const main = document.getElementById("main");
const data_for_prompt = document.getElementById("data-for-prompt");
const loader = document.getElementById("loader");
const output = document.getElementById("output");
const recipeNames = document.getElementById("recipe-names");
const title = document.getElementById("title");
const ingredients = document.getElementById("ingredients");
const instructions = document.getElementById("instructions");
const time = document.getElementById("time");
const nutritionalFacts = document.getElementById("nutritionalFacts");
const error = document.getElementById("error");

let allergy = "";
let cusine = "";
let firstIngredient = "";
let secondIngredient = "";
let thirdIngredient = "";

function getData() {
  data_for_prompt.style.display = "none";
  loader.classList.remove("d-none");
  loader.classList.add("d-block");
  allergy = document.getElementById("allergy").value;
  cusine = document.getElementById("cuisine").value;
  firstIngredient = document.getElementById("ingredient1").value;
  secondIngredient = document.getElementById("ingredient2").value;
  thirdIngredient = document.getElementById("ingredient3").value;

  getRecipes();
}

function errorOccured() {
  main.classList.add("d-none");
  error.classList.remove("d-none");
  error.classList.add("d-block");
}

async function getRecipes() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    I am a Chef. I need to create ${cusine} recipes for customers.
    ${
      allergy === ""
        ? ""
        : "However, don't include recipes that use ingredients with the customers " +
          allergy +
          " allergy"
    }
    ${firstIngredient === "" ? "" : "I have " + firstIngredient}
    ${secondIngredient === "" ? "" : ", " + secondIngredient}
    ${thirdIngredient === "" ? "" : " ,and " + thirdIngredient}
    ${firstIngredient === "" ? "" : "in my kitchen and other ingredients."}
    Please provide some meal recommendations in proper json format without markdown.
    For each recommendation as "recommendations", include required ingredients and quantity in a sentence as "ingredients" in an array,
    preparation instructions as "instructions" in an array,
    time to prepare as "time" and the recipe title as "title".
    provide the nutritional facts as "nutritionalFacts" having the calories as "calories", fat as "fat", protein as "protein" and carbohydrates as "carbohydrates" and write the values of nutritional facts within double qoutes.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    var text = response.text();

    console.log(text);
    text = text.replace("```json", "");
    text = text.replace("```", "");
    //   console.log(recipesJSON);
    const recipes = JSON.parse(text);

    injectDishNames(recipes);

    console.log(recipes);
  } catch (e) {
    console.log(e);
    errorOccured();
  }
}

function injectDishNames(recipes) {
  let num_recipes = recipes.recommendations.length;

  document.getElementsByTagName("body")[0].style.background =
    "linear-gradient(0deg, rgba(234, 141, 141, 1) 0%, rgba(168, 144, 254, 1) 100%)";

  recipes.recommendations.forEach((recipe) => {
    recipeNames.innerHTML += `<p class="recipe-name col-${
      12 / num_recipes - 1
    } m-2">${recipe.title}</p>`;
  });

  injectData(recipes.recommendations[0]);

  let recipe_name_boxes = document.getElementsByClassName("recipe-name");

  for (let i = 0; i < recipe_name_boxes.length; i++) {
    recipe_name_boxes[i].addEventListener("click", () => {
      resetWindow();
      injectData(recipes.recommendations[i]);
    });
  }
}

function resetWindow() {
  ingredients.innerHTML = "";
  instructions.innerHTML = "";
  nutritionalFacts.innerHTML = "";
}

function injectData(recipe) {
  console.log(recipe);
  loader.classList.remove("d-block");
  loader.classList.add("d-none");
  output.style.display = "block";

  resetWindow();

  title.textContent = recipe.title;

  recipe.ingredients.forEach((ingredient) => {
    ingredients.innerHTML += `<li class="h5">${ingredient}</li>`;
  });

  recipe.instructions.forEach((step) => {
    instructions.innerHTML += `<li class="h5">${step}</li>`;
  });

  time.innerHTML = recipe.time;

  nutritionalFacts.innerHTML += `<li class="h5">Calories: ${recipe.nutritionalFacts.calories}</li>`;
  nutritionalFacts.innerHTML += `<li class="h5">Fat: ${recipe.nutritionalFacts.fat}</li>`;
  nutritionalFacts.innerHTML += `<li class="h5">Carbohydrates: ${recipe.nutritionalFacts.carbohydrates}</li>`;
  nutritionalFacts.innerHTML += `<li class="h5">Protein: ${recipe.nutritionalFacts.protein}</li>`;
}

var testData = `
{
  "recommendations": [
   {
    "title": "Mutton Biryani",
    "ingredients": [
     "1 kg mutton, cut into small pieces",
     "1 cup basmati rice",
     "1 large onion, sliced",
     "1/2 cup chopped tomatoes",
     "1/4 cup chopped green bell pepper",
     "1/4 cup chopped red bell pepper",
     "1/2 cup yogurt",
     "1 tablespoon ginger-garlic paste",
     "1 teaspoon red chili powder",
     "1 teaspoon turmeric powder",
     "1 teaspoon coriander powder",
     "1/2 teaspoon garam masala",
     "1/4 cup chopped fresh coriander leaves",
     "Salt to taste"
    ],
    "instructions": [
     "Marinate the mutton in the yogurt, ginger-garlic paste, red chili powder, turmeric powder, coriander powder, and salt for at least 30 minutes.",
     "Heat the oil in a large pot or Dutch oven over medium heat.",
     "Add the onion and cook until softened, about 5 minutes.",
     "Add the tomatoes, green bell pepper, and red bell pepper and cook until softened, about 5 minutes more.",
     "Add the marinated mutton to the pot and cook until browned on all sides, about 5 minutes.",
     "Add the rice, water, and salt to taste.",
     "Bring to a boil, then reduce heat to low, cover, and simmer for 20 minutes, or until the rice is cooked through.",
     "Stir in the chopped fresh coriander leaves and serve."
    ],
    "time": "60 minutes",
    "nutritionalFacts": {
    "calories": "450",
     "fat": "15g",
     "protein": "30g",
     "carbohydrates": "50g"
     }
   },
   {
    "title": "Mutton Curry",
    "ingredients": [
     "1 kg mutton, cut into small pieces",
     "1 large onion, sliced",
     "1/2 cup chopped tomatoes",
     "1/4 cup chopped green bell pepper",
     "1/4 cup chopped red bell pepper",
     "1 tablespoon ginger-garlic paste",
     "1 teaspoon red chili powder",
     "1 teaspoon turmeric powder",
     "1 teaspoon coriander powder",
     "1/2 teaspoon garam masala",
     "1/4 cup chopped fresh coriander leaves",
     "Salt to taste"
    ],
    "instructions": [
     "Heat the oil in a large pot or Dutch oven over medium heat.",
     "Add the onion and cook until softened, about 5 minutes.",
     "Add the tomatoes, green bell pepper, and red bell pepper and cook until softened, about 5 minutes more.",
     "Add the mutton, ginger-garlic paste, red chili powder, turmeric powder, coriander powder, and salt to taste.",
     "Cook on medium heat for 15 minutes, or until the mutton is browned on all sides.",
     "Add water to cover the mutton and bring to a boil.",
     "Reduce heat to low, cover, and simmer for 1 hour, or until the mutton is tender.",
     "Stir in the chopped fresh coriander leaves and serve."
    ],
    "time": "75 minutes",
    "nutritionalFacts": {
     "calories": "350",
     "fat": "10g",
     "protein": "25g",
     "carbohydrates": "40g"
    }
   },
   {
    "title": "Mutton Kebabs",
    "ingredients": [
     "1 kg mutton, minced",
     "1 large onion, chopped",
     "1/2 cup chopped green bell pepper",
     "1/4 cup chopped red bell pepper",
     "1 tablespoon ginger-garlic paste",
     "1 teaspoon red chili powder",
     "1 teaspoon turmeric powder",
     "1 teaspoon coriander powder",
     "1/2 teaspoon garam masala",
     "1/4 cup chopped fresh coriander leaves",
     "Salt to taste"
    ],
    "instructions": [
     "In a large bowl, combine the mutton, onion, green bell pepper, red bell pepper, ginger-garlic paste, red chili powder, turmeric powder, coriander powder, garam masala, chopped fresh coriander leaves, and salt to taste.",
     "Mix well and form into kebabs.",
     "Grill or roast the kebabs over medium heat until cooked through.",
     "Serve with your favorite dipping sauce."
    ],
    "time": "45 minutes",
    "nutritionalFacts": {
     "calories": "250",
     "fat": "10g",
     "protein": "20g",
     "carbohydrates": "30g"
    }
   }
  ]
 }`;
