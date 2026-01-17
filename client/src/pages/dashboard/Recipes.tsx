import { useState, useEffect } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FeatureLock } from "@/components/dashboard/FeatureLock";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Recipe, RecipeFilters as RecipeFiltersType } from "@/lib/types";

export default function Recipes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [remainingViews, setRemainingViews] = useState<number | null>(null);

  const isPremium = user?.role === "premium" || user?.role === "admin";

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [filters, currentPage]);

  async function fetchRecipes() {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: isPremium ? "15" : "3",
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== "") {
            acc[key] = Array.isArray(value) ? value.join(",") : value.toString();
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`/api/recipes?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.upgradeUrl) {
          toast({
            title: error.error || "Limit dostignut",
            description: error.message,
            variant: "destructive",
          });
          setRecipes([]);
          return;
        }
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      
      // Parse JSON fields if they're strings
      const parsedRecipes = data.recipes.map((recipe: any) => ({
        ...recipe,
        ingredients: typeof recipe.ingredients === "string" 
          ? JSON.parse(recipe.ingredients) 
          : recipe.ingredients,
        instructions: typeof recipe.instructions === "string"
          ? JSON.parse(recipe.instructions)
          : recipe.instructions,
      }));

      setRecipes(parsedRecipes);
      setPagination(data.pagination);
      setRemainingViews(data.remainingViews ?? null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Greška",
        description: "Nije moguće učitati recepte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFavoriteToggle(recipeId: number) {
    // This will be handled by RecipeCard component
    await fetchRecipes();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Recepti</h1>
              <p className="text-gray-600">
                {isPremium
                  ? `Pregledaj našu kolekciju od ${pagination.totalCount}+ zdravih recepata.`
                  : "Pregledaj demo recepte (3 besplatna). Upgrade za pristup svim receptima!"}
              </p>
            </div>

            {/* Filters */}
            <RecipeFilters
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              isPremium={isPremium}
            />

            {/* Status Badge */}
            {isPremium ? (
              <Badge className="bg-[#1F7A5C] hover:bg-[#185A44]">
                Premium - Neograničen pristup
              </Badge>
            ) : remainingViews !== null ? (
              <Badge className="bg-orange-500 hover:bg-orange-600">
                Free Trial - Preostalo pregleda: {remainingViews}
              </Badge>
            ) : null}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1F7A5C]" />
              </div>
            )}

            {/* Recipe Grid */}
            {!isLoading && recipes.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isPremium={isPremium}
                      isLocked={!isPremium && recipes.indexOf(recipe) >= 3}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!pagination.hasPreviousPage}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                      Strana {currentPage} od {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && recipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  Nema recepata koji odgovaraju vašim filterima.
                </p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Resetuj filtere
                </Button>
              </div>
            )}

            {/* Lock Overlay for Free Users */}
            {!isPremium && recipes.length > 0 && (
              <FeatureLock
                title="Otkljucaj 45+ Zdravih Recepata"
                description="Upgrade na Premium za neograničen pristup svim receptima, naprednim filterima i meal planner funkcionalnosti."
                features={[
                  "45+ recepata sa detaljnim instrukcijama",
                  "Napredno filtriranje (alergije, kalorije, vreme)",
                  "Neograničeni favoriti",
                  "7-dnevni meal planner",
                  "Auto-generisana shopping lista",
                ]}
                variant="card"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
