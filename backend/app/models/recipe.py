# app/models/recipe.py
from pydantic import BaseModel
from typing import List

class IngredientsRequest(BaseModel):
    ingredients: List[str]  # List of ingredients, e.g., ["tomato", "onion", "chicken"]

class RecipeResponse(BaseModel):
    dish_name: str
    recipe: str
    steps: List[str]
    nutritional_value: dict  # E.g., {"calories": 500, "protein": "30g", ...}