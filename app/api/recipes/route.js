import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (request, res) => {
  try {
    const {
      allergy,
      cuisine,
      firstIngredient,
      secondIngredient,
      thirdIngredient,
    } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      I am a Chef. I need to create ${cuisine} recipes for customers.
      ${
        allergy
          ? "However, don't include recipes that use ingredients with the customers " +
            allergy +
            " allergy"
          : ""
      }
      ${firstIngredient ? "I have " + firstIngredient : ""}
      ${secondIngredient ? ", " + secondIngredient : ""}
      ${thirdIngredient ? " ,and " + thirdIngredient : ""}
      ${firstIngredient ? "in my kitchen and other ingredients." : ""}
      Please provide some meal recommendations in proper json format without markdown.
      For each recommendation as "recommendations", include required ingredients and quantity in a sentence as "ingredients" in an array,
      preparation instructions as "instructions" in an array,
      time to prepare as "time" and the recipe title as "title".
      provide the nutritional facts as "nutritionalFacts" having the calories as "calories", fat as "fat", protein as "protein" and carbohydrates as "carbohydrates" and write the values of nutritional facts within double qoutes.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = await response.text();
    text = text.replace("```json", "");
    text = text.replace("```", "");
    const recipes = JSON.parse(text).recommendations;

    return new Response(JSON.stringify({ recommendations: recipes }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch recipes", { status: 500 });
  }
};
