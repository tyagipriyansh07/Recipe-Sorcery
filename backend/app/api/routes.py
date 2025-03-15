# app/api/routes.py
from fastapi import APIRouter
from app.models.recipe import IngredientsRequest, RecipeResponse
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

@router.post("/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: IngredientsRequest):
    # Call the LLM service to generate the recipe
    recipe_data = llm_service.generate_recipe(request.ingredients)
    return RecipeResponse(**recipe_data)