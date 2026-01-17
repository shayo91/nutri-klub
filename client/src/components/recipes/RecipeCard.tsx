import { Clock, Users, Flame, ChefHat, Heart, Lock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/types";
import { Link } from "wouter";

interface RecipeCardProps {
  recipe: Recipe;
  isPremium?: boolean;
  isLocked?: boolean;
  onFavoriteToggle?: (recipeId: number) => void;
}

export function RecipeCard({
  recipe,
  isPremium = false,
  isLocked = false,
  onFavoriteToggle,
}: RecipeCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.imageUrl || "https://via.placeholder.com/400x300"}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Premium</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <Badge className="absolute top-2 left-2 bg-[#1F7A5C] text-white">
          {recipe.category}
        </Badge>

        {/* Difficulty Badge */}
        <Badge
          className={`absolute top-2 right-2 ${difficultyColors[recipe.difficulty]}`}
        >
          {recipe.difficulty}
        </Badge>

        {/* Favorite Button (Premium only) */}
        {isPremium && onFavoriteToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle(recipe.id);
            }}
          >
            <Heart
              className={`w-5 h-5 ${recipe.isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#1F7A5C] transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {recipe.description}
        </p>

        {/* Recipe Info */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} porcije</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            <span>{recipe.calories} kcal</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.protein}g proteina</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        {isLocked ? (
          <Link href="/dashboard/upgrade" className="w-full">
            <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
              <Lock className="w-4 h-4 mr-2" />
              Aktiviraj Premium
            </Button>
          </Link>
        ) : (
          <Link href={`/dashboard/recipes/${recipe.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Pogledaj Recept
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
