import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDpziq3TzJlYk-8ej4v07BdrzB9lfyR9Vk");

document.getElementById("dataSubmitButton").addEventListener("click", getData);

const main = document.getElementById("main");
const data_for_prompt = document.getElementById("data-for-prompt");
const loader = document.getElementById("loader");
const output = document.getElementById("output");
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
    loader.classList.remove("d-block");
    loader.classList.add("d-none");
    output.style.display = "block";

    title.textContent = recipes.recommendations[0].title;

    recipes.recommendations[0].ingredients.forEach((ingredient) => {
      ingredients.innerHTML += `<li class="h5">${ingredient}</li>`;
    });

    recipes.recommendations[0].instructions.forEach((step) => {
      instructions.innerHTML += `<li class="h5">${step}</li>`;
    });

    time.innerHTML = recipes.recommendations[0].time;

    nutritionalFacts.innerHTML += `<li class="h5">Calories: ${recipes.recommendations[0].nutritionalFacts.calories}</li>`;
    nutritionalFacts.innerHTML += `<li class="h5">Fat: ${recipes.recommendations[0].nutritionalFacts.fat}</li>`;
    nutritionalFacts.innerHTML += `<li class="h5">Carbohydrates: ${recipes.recommendations[0].nutritionalFacts.carbohydrates}</li>`;
    nutritionalFacts.innerHTML += `<li class="h5">Protein: ${recipes.recommendations[0].nutritionalFacts.protein}</li>`;
    console.log(recipes);
  } catch (e) {
    console.log(e);
    errorOccured();
  }
}
