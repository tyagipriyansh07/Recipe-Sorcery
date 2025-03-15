
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Loader2, Clock, Utensils, Heart, Bookmark, Share2, Camera, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import RecipeCard from "./RecipeCard";

const RecipeForm: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecipe(null);

    const ingredientsArray = ingredients.split(",").map((item) => item.trim()).filter((item) => item);

    if (ingredientsArray.length === 0) {
      toast({
        title: "Missing ingredients",
        description: "Please enter at least one ingredient.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending request to backend with ingredients:", ingredientsArray);
      
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate recipe: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Recipe data received:", data);
      setRecipe(data);
      toast({
        title: "Recipe generated!",
        description: `Your ${data.dish_name} recipe is ready.`,
      });
    } catch (err) {
      console.error("Error generating recipe:", err);
      toast({
        title: "Generation failed",
        description: "Error generating recipe. Please check your backend or try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format recipe data for RecipeCard component
  const formatRecipeForCard = () => {
    if (!recipe) return null;

    // Parse out preparation and cooking time from recipe text
    let prepTime = "N/A";
    let cookTime = "N/A";
    let servings = "2-4";

    const recipeText = typeof recipe.recipe === 'string' ? recipe.recipe : JSON.stringify(recipe.recipe);
    
    // Extract prep time
    const prepTimeMatch = recipeText.match(/Prep Time: ([^\n]+)/);
    if (prepTimeMatch) prepTime = prepTimeMatch[1];
    
    // Extract cook time
    const cookTimeMatch = recipeText.match(/Cook Time: ([^\n]+)/);
    if (cookTimeMatch) cookTime = cookTimeMatch[1];

    // Extract ingredients
    const ingredientsList = [];
    if (recipeText.includes("Ingredients:")) {
      const ingredientsSection = recipeText.split("Ingredients:")[1].split("\n\n")[0];
      const ingredientLines = ingredientsSection.split("\n");
      for (const line of ingredientLines) {
        if (line.trim().startsWith("-")) {
          ingredientsList.push(line.trim().substring(1).trim());
        }
      }
    }

    // Format steps as an array
    let instructions = [];
    if (Array.isArray(recipe.steps)) {
      instructions = recipe.steps.map((step: any) => 
        typeof step === 'string' ? step : JSON.stringify(step)
      );
    } else if (typeof recipe.steps === 'string') {
      instructions = recipe.steps.split('\n').filter((s: string) => s.trim());
    }

    return {
      title: recipe.dish_name,
      ingredients: ingredientsList,
      instructions: instructions,
      cuisine: "Homemade",
      preparationTime: prepTime,
      servings: servings
    };
  };

  const formattedRecipe = recipe ? formatRecipeForCard() : null;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 md:px-0">
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6 text-primary">
            <ChefHat className="h-8 w-8 mr-2" />
            <h2 className="text-2xl font-serif font-semibold">Recipe Generator</h2>
          </div>
          
          <form onSubmit={handleGenerateRecipe} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter ingredients (e.g., chicken, tomato, onion)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Recipe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {recipe && formattedRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <RecipeCard recipe={formattedRecipe} />
          
          {recipe.nutritional_value && (
            <Card className="mt-4 overflow-hidden border border-border/50 shadow-md">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-serif font-semibold text-primary flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Nutritional Value
                  </h3>
                  <div className="h-1 w-20 bg-primary/30 rounded-full mt-1"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(recipe.nutritional_value).map(([key, value]) => (
                    <div key={key} className="bg-accent/30 p-3 rounded-lg text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{key}</p>
                      <p className="font-semibold">
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" /> Save
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Camera className="h-4 w-4" /> Print
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipeForm;
