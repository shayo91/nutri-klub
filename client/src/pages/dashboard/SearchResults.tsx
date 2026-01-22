import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookMarked, Clock, Users, Flame, ChefHat, Search as SearchIcon } from "lucide-react";
import { Link } from "wouter";

interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  calories: number;
  servings: number;
}

interface Ebook {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  category: string;
  pages: number;
  isPremium: boolean;
}

export default function SearchResults() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    setSearchQuery(query);

    if (query) {
      searchContent(query);
    } else {
      // Reset results when search is cleared
      setRecipes([]);
      setEbooks([]);
      setLoading(false);
    }
  }, [location]);

  async function searchContent(query: string) {
    setLoading(true);
    try {
      // Search recipes
      const recipesRes = await fetch(`/api/recipes?search=${encodeURIComponent(query)}&limit=20`, {
        credentials: "include",
      });
      const recipesData = await recipesRes.json();
      setRecipes(recipesData.recipes || []);

      // Search ebooks
      const ebooksRes = await fetch(`/api/ebooks?search=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const ebooksData = await ebooksRes.json();
      setEbooks(ebooksData.ebooks || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalResults = recipes.length + ebooks.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SearchIcon className="w-8 h-8 text-[#1F7A5C]" />
                <h1 className="text-3xl font-bold text-gray-900">Rezultati Pretrage</h1>
              </div>
              {searchQuery && (
                <p className="text-gray-600">
                  Pronađeno <span className="font-semibold">{totalResults}</span> rezultata za "{searchQuery}"
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F7A5C]"></div>
              </div>
            ) : !searchQuery ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Pretraži našu biblioteku
                  </h3>
                  <p className="text-gray-600">
                    Koristi search bar gore da pronađeš recepte i e-bookove
                  </p>
                </CardContent>
              </Card>
            ) : totalResults === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nema rezultata
                  </h3>
                  <p className="text-gray-600">
                    Pokušaj sa drugačijim pojmom ili proveri pravopis
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">
                    Sve ({totalResults})
                  </TabsTrigger>
                  <TabsTrigger value="recipes">
                    Recepti ({recipes.length})
                  </TabsTrigger>
                  <TabsTrigger value="ebooks">
                    E-bookovi ({ebooks.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {recipes.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-[#1F7A5C]" />
                        Recepti ({recipes.length})
                      </h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipes.map((recipe) => (
                          <Link key={recipe.id} href={`/dashboard/recipes/${recipe.id}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-full h-40 object-cover"
                              />
                              <CardHeader>
                                <div className="flex gap-2 mb-2">
                                  <Badge variant="secondary">{recipe.category}</Badge>
                                  <Badge variant="outline">{recipe.difficulty}</Badge>
                                </div>
                                <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {recipe.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {recipe.prepTime + recipe.cookTime} min
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Flame className="w-4 h-4" />
                                    {recipe.calories} kcal
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {recipe.servings}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {ebooks.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BookMarked className="w-5 h-5 text-[#1F7A5C]" />
                        E-bookovi ({ebooks.length})
                      </h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {ebooks.map((ebook) => (
                          <Link key={ebook.id} href={`/dashboard/ebooks`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                              <img
                                src={ebook.coverImageUrl}
                                alt={ebook.title}
                                className="w-full h-48 object-cover"
                              />
                              <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="secondary">{ebook.category}</Badge>
                                  {ebook.isPremium && (
                                    <Badge className="bg-[#FFD700] text-gray-900">Premium</Badge>
                                  )}
                                </div>
                                <CardTitle className="text-base line-clamp-2">{ebook.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2">
                                  {ebook.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <BookOpen className="w-4 h-4" />
                                  {ebook.pages} stranica
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recipes">
                  {recipes.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-600">Nema recepata za ovaj pojam</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recipes.map((recipe) => (
                        <Link key={recipe.id} href={`/dashboard/recipes/${recipe.id}`}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <img
                              src={recipe.imageUrl}
                              alt={recipe.title}
                              className="w-full h-40 object-cover"
                            />
                            <CardHeader>
                              <div className="flex gap-2 mb-2">
                                <Badge variant="secondary">{recipe.category}</Badge>
                                <Badge variant="outline">{recipe.difficulty}</Badge>
                              </div>
                              <CardTitle className="text-lg line-clamp-2">{recipe.title}</CardTitle>
                              <CardDescription className="line-clamp-2">
                                {recipe.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {recipe.prepTime + recipe.cookTime} min
                                </div>
                                <div className="flex items-center gap-1">
                                  <Flame className="w-4 h-4" />
                                  {recipe.calories} kcal
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {recipe.servings}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ebooks">
                  {ebooks.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-600">Nema e-bookova za ovaj pojam</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {ebooks.map((ebook) => (
                        <Link key={ebook.id} href={`/dashboard/ebooks`}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <img
                              src={ebook.coverImageUrl}
                              alt={ebook.title}
                              className="w-full h-48 object-cover"
                            />
                            <CardHeader>
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary">{ebook.category}</Badge>
                                {ebook.isPremium && (
                                  <Badge className="bg-[#FFD700] text-gray-900">Premium</Badge>
                                )}
                              </div>
                              <CardTitle className="text-base line-clamp-2">{ebook.title}</CardTitle>
                              <CardDescription className="text-xs line-clamp-2">
                                {ebook.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BookOpen className="w-4 h-4" />
                                {ebook.pages} stranica
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
