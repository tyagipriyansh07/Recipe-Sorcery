
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, Copy, Users, ChefHat, Utensils, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export interface RecipeData {
  title: string;
  ingredients: string[];
  instructions: string[];
  cuisine?: string;
  preparationTime?: string;
  servings?: string;
}

interface RecipeCardProps {
  recipe: RecipeData;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    const recipeText = `
Recipe: ${recipe.title}

Ingredients:
${recipe.ingredients.map(ingredient => `- ${ingredient}`).join('\n')}

Instructions:
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(recipeText);
    
    toast({
      title: "Recipe copied",
      description: "The recipe has been copied to your clipboard.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="border border-border/50 shadow-md overflow-hidden recipe-card">
        <CardHeader className="pb-4 pt-6 px-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              {recipe.cuisine && (
                <Badge variant="outline" className="recipe-tag mb-2 bg-primary/20 text-primary-foreground">
                  {recipe.cuisine}
                </Badge>
              )}
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">{recipe.title}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {recipe.preparationTime && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{recipe.preparationTime}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-3 w-3" />
                  <span>{recipe.servings}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Utensils className="h-4 w-4 mr-2 text-primary" />
              Ingredients
              <div className="h-1 w-12 bg-primary/30 rounded-full ml-2"></div>
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start bg-accent/10 p-2 rounded-md"
                >
                  <span className="mr-2 text-primary">•</span>
                  <span>{ingredient}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Flame className="h-4 w-4 mr-2 text-primary" />
              Instructions
              <div className="h-1 w-12 bg-primary/30 rounded-full ml-2"></div>
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((instruction, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-md"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: index % 2 === 0 ? 'rgba(var(--accent), 0.1)' : 'transparent',
                  }}
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="hover:bg-primary/20"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Recipe
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-primary/80 hover:bg-primary text-primary-foreground"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Save Recipe
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;
