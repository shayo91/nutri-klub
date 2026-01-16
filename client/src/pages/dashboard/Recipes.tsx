import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FeatureLock } from "@/components/dashboard/FeatureLock";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Recipes() {
  const { isPremium } = useAuth();

  const sampleRecipes = [
    {
      id: 1,
      title: "Proteinsko Smoothie Bowl",
      category: "Doručak",
      calories: 350,
      time: "10 min",
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
    },
    {
      id: 2,
      title: "Piletina sa Povrćem",
      category: "Ručak",
      calories: 450,
      time: "30 min",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
    },
    {
      id: 3,
      title: "Losos sa Avokadom",
      category: "Večera",
      calories: 520,
      time: "25 min",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    },
  ];

  if (!isPremium) {
    // Show only 3 demo recipes for free users
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Recepti</h1>
                <p className="text-gray-600">
                  Pregledaj demo recepte (3 besplatna). Upgrade za pristup svim receptima!
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Pretraži recepte..."
                    className="pl-10"
                    disabled
                  />
                </div>
                <Button variant="outline" disabled>
                  <Filter className="w-4 h-4 mr-2" />
                  Filteri
                </Button>
              </div>

              <Badge className="bg-orange-500 hover:bg-orange-600">
                Free Trial - 3 demo recepta dostupna
              </Badge>

              {/* Sample Recipes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{recipe.category}</Badge>
                        <span className="text-sm text-gray-600">{recipe.time}</span>
                      </div>
                      <CardTitle className="text-lg">{recipe.title}</CardTitle>
                      <CardDescription>{recipe.calories} kcal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Pogledaj Recept
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Lock Overlay for Premium Content */}
              <FeatureLock
                title="Otkljucaj 500+ Zdravih Recepata"
                description="Upgrade na Premium za neograničen pristup svim receptima, naprednim filterima i meal planner funkcionalnosti."
                features={[
                  "500+ recepata sa detaljnim instrukcijama",
                  "Napredno filtriranje (alergije, kalorije, vreme)",
                  "Neograničeni favoriti",
                  "7-dnevni meal planner",
                  "Auto-generisana shopping lista",
                ]}
                variant="card"
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Premium users see full recipe library
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Recepti</h1>
              <p className="text-gray-600">
                Pregledaj našu kolekciju od 500+ zdravih recepata.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Pretraži recepte..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filteri
              </Button>
            </div>

            <Badge className="bg-[#1F7A5C] hover:bg-[#185A44]">
              Premium - Neograničen pristup
            </Badge>

            {/* Full Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...sampleRecipes, ...sampleRecipes, ...sampleRecipes].map((recipe, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{recipe.category}</Badge>
                      <span className="text-sm text-gray-600">{recipe.time}</span>
                    </div>
                    <CardTitle className="text-lg">{recipe.title}</CardTitle>
                    <CardDescription>{recipe.calories} kcal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
                      Pogledaj Recept
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
