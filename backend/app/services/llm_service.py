# app/services/llm_service.py
from groq import Groq
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set")
        self.client = Groq(api_key=api_key)

    def generate_recipe(self, ingredients: list) -> dict:
        # Refined prompt to match the desired output format
        prompt = (
            f"Given the following ingredients: {', '.join(ingredients)}, "
            "create a detailed recipe for a dish. Format the response EXACTLY as follows:\n"
            "Dish Name: [name of the dish]\n"
            "Description: [a brief description of the dish]\n"
            "Prep Time: [time in minutes]\n"
            "Cook Time: [time in minutes]\n"
            "Ingredients:\n- [quantity and ingredient 1]\n- [quantity and ingredient 2]\n...\n"
            "Steps:\n1. [step 1]\n2. [step 2]\n...\n"
            "Nutritional Value: calories: [number] kcal, protein: [number]g, carbs: [number]g, fats: [number]g"
        )

        # Call the Groq API
        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="mixtral-8x7b-32768",  # Adjust model if needed
            max_tokens=1000,
            temperature=0.7  # Lower temperature for more consistent output
        )

        # Log the raw response for debugging
        response_text = response.choices[0].message.content
        logger.debug(f"Raw LLM response:\n{response_text}")

        # Parse the response
        lines = response_text.split("\n")
        dish_name = ""
        description = ""
        prep_time = ""
        cook_time = ""
        ingredients_list = []
        steps = []
        nutritional_value = {}

        current_section = None
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if line.startswith("Dish Name:"):
                dish_name = line.replace("Dish Name:", "").strip()
            elif line.startswith("Description:"):
                description = line.replace("Description:", "").strip()
            elif line.startswith("Prep Time:"):
                prep_time = line.replace("Prep Time:", "").strip()
            elif line.startswith("Cook Time:"):
                cook_time = line.replace("Cook Time:", "").strip()
            elif line.startswith("Ingredients:"):
                current_section = "ingredients"
            elif line.startswith("Steps:"):
                current_section = "steps"
            elif line.startswith("Nutritional Value:"):
                current_section = "nutrition"
                nutrition_text = line.replace("Nutritional Value:", "").strip()
                pairs = nutrition_text.split(",")
                for pair in pairs:
                    pair = pair.strip()
                    if ":" in pair:
                        key, value = pair.split(":")
                        nutritional_value[key.strip()] = value.strip()
                    else:
                        logger.warning(f"Skipping malformed nutritional pair: {pair}")
            elif current_section == "ingredients" and line.startswith("-"):
                ingredients_list.append(line.replace("-", "").strip())
            elif current_section == "steps" and line.startswith(tuple(f"{i}." for i in range(1, 20))):
                # Remove the step number (e.g., "1. ") and append the step
                step_text = line.split(".", 1)[1].strip()
                steps.append(step_text)

        # Combine description, prep time, cook time, and ingredients into the recipe field
        recipe = (
            f"{description}\n\n"
            f"Prep Time: {prep_time}\n"
            f"Cook Time: {cook_time}\n\n"
            f"Ingredients:\n" + "\n".join(f"- {item}" for item in ingredients_list)
        )

        return {
            "dish_name": dish_name,
            "recipe": recipe,
            "steps": steps,
            "nutritional_value": nutritional_value
        }