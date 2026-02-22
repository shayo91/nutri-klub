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
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
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
  
  // Scroll to top when overlay is shown
  useEffect(() => {
    if (hasReachedLimit && !isPremium) {
      // Scroll to the recipes section
      const recipesSection = document.querySelector('.recipes-grid-section');
      if (recipesSection) {
        recipesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [hasReachedLimit, isPremium]);

  async function fetchRecipes() {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "15",
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
          // User has reached the limit
          setHasReachedLimit(true);
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
      
      // Check if user has reached the limit (for showing overlay)
      if (data.hasReachedLimit === true || data.recipeViewCount >= 3) {
        setHasReachedLimit(true);
      } else {
        setHasReachedLimit(false);
      }
      
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
      
      // Set pagination data
      if (data.pagination) {
        setPagination(data.pagination);
      } else {
        // If no pagination data (shouldn't happen), set defaults
        setPagination({
          totalCount: parsedRecipes.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      }
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
                Pregledaj našu kolekciju od ${pagination.totalCount}+ zdravih recepata.
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
            {!isPremium ? (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Free Trial - Do 5 recepata
              </Badge>
            ) : (
              <Badge className="bg-[#1F7A5C] hover:bg-[#185A44]">
                Premium - Neograničen pristup
              </Badge>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1F7A5C]" />
              </div>
            )}

            {/* Recipe Grid */}
            {!isLoading && recipes.length > 0 && (
              <>
                <div className="relative min-h-[600px] recipes-grid-section">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isPremium={isPremium}
                        isLocked={false}
                        onFavoriteToggle={handleFavoriteToggle}
                      />
                    ))}
                  </div>
                  
                  {/* Lock Overlay - Only over recipe grid */}
                  {!isPremium && hasReachedLimit && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-start justify-center p-6 pt-12 rounded-lg overflow-y-auto">
                      <FeatureLock
                        title="Otkljucaj 45+ Zdravih Recepata"
                        description="Iskoristili ste 3 besplatna recepta! Upgrade na Premium za neograničen pristup."
                        features={[
                          "45+ recepata sa detaljnim instrukcijama",
                          "Napredno filtriranje (alergije, kalorije, vreme)",
                          "Neograničeni favoriti",
                          "7-dnevni meal planner",
                          "Auto-generisana shopping lista",
                        ]}
                        variant="card"
                      />
                    </div>
                  )}
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

          </div>
        </main>
      </div>
    </div>
  );
}
