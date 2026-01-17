import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  Clock,
  Users,
  Flame,
  ChefHat,
  Heart,
  Share2,
  Printer,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import type { Recipe } from "@/lib/types";

export default function RecipeDetail() {
  const [, params] = useRoute("/dashboard/recipes/:id");
  const recipeId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const isPremium = user?.role === "premium" || user?.role === "admin";

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  async function fetchRecipe() {
    if (!recipeId) return;

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }

      const data = await response.json();
      
      // Parse JSON fields if they're strings
      const parsedRecipe = {
        ...data,
        ingredients: typeof data.ingredients === "string" 
          ? JSON.parse(data.ingredients)
          : data.ingredients,
        instructions: typeof data.instructions === "string"
          ? JSON.parse(data.instructions)
          : data.instructions,
      };

      setRecipe(parsedRecipe);
      setIsFavorited(data.isFavorited || false);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast({
        title: "Greška",
        description: "Nije moguće učitati recept.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleFavorite() {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Favoriti su dostupni samo za Premium korisnike.",
        variant: "destructive",
      });
      return;
    }

    try {
      const method = isFavorited ? "DELETE" : "POST";
      const response = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method,
        credentials: "include",
      });

      if (!response.ok) throw new Error();

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Uklonjeno iz favorita" : "Dodato u favorite",
        description: isFavorited
          ? "Recept je uklonjen iz vaših favorita."
          : "Recept je dodat u vaše favorite.",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške. Pokušajte ponovo.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">Recept nije pronađen</h1>
              <Link href="/dashboard/recipes">
                <Button>Nazad na recepte</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link href="/dashboard/recipes">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nazad na recepte
              </Button>
            </Link>

            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    <Badge className="bg-[#1F7A5C] text-white">
                      {recipe.category}
                    </Badge>
                    <Badge variant="outline">{recipe.difficulty}</Badge>
                    <Badge variant="outline">{recipe.source}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {recipe.title}
                  </h1>
                  <p className="text-gray-600">{recipe.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    disabled={!isPremium}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Printer className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Recipe Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Vreme</p>
                    <p className="font-semibold">
                      {recipe.prepTime + recipe.cookTime} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Porcije</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Flame className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Kalorije</p>
                    <p className="font-semibold">{recipe.calories} kcal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ChefHat className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Proteini</p>
                    <p className="font-semibold">{recipe.protein}g</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Image */}
            <div className="mb-6">
              <img
                src={recipe.imageUrl || "https://via.placeholder.com/1200x600"}
                alt={recipe.title}
                className="w-full h-96 object-cover rounded-lg shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ingredients */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Sastojci</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{ingredient.name}</span>
                        <span className="text-gray-600">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {isPremium && (
                    <>
                      <Separator className="my-4" />
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Dodaj u shopping listu
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Instructions & Nutrition */}
              <div className="lg:col-span-2 space-y-6">
                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Uputstvo za pripremu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center font-semibold">
                            {index + 1}
                          </span>
                          <p className="text-gray-700 pt-1">{instruction}</p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                {/* Nutrition */}
                <Card>
                  <CardHeader>
                    <CardTitle>Nutricione vrednosti</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1F7A5C]">
                          {recipe.calories}
                        </p>
                        <p className="text-sm text-gray-600">Kalorije</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1F7A5C]">
                          {recipe.protein}g
                        </p>
                        <p className="text-sm text-gray-600">Proteini</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1F7A5C]">
                          {recipe.carbs}g
                        </p>
                        <p className="text-sm text-gray-600">Ugljeni hidrati</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-[#1F7A5C]">
                          {recipe.fats}g
                        </p>
                        <p className="text-sm text-gray-600">Masti</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
