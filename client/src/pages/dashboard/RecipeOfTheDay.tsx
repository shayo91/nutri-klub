import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FeatureLock } from "@/components/dashboard/FeatureLock";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Clock, Flame, Heart, Calendar } from "lucide-react";

export default function RecipeOfTheDay() {
  const { isPremium } = useAuth();

  const todayRecipe = {
    title: "Losos sa Avokadom i Quinoa",
    category: "Ručak",
    calories: 520,
    protein: 35,
    carbs: 45,
    fats: 22,
    prepTime: "15 min",
    cookTime: "20 min",
    difficulty: "Srednje",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    description:
      "Savršena kombinacija omega-3 masnih kiselina iz lososa, zdravih masti iz avokada i kompleksnih ugljenih hidrata iz quinoe.",
  };

  const recipeContent = (
    <div className="space-y-6">
      {/* Recipe Image */}
      <div className="relative">
        <img
          src={todayRecipe.image}
          alt={todayRecipe.title}
          className="w-full h-96 object-cover rounded-xl"
        />
        <Badge className="absolute top-4 left-4 bg-[#1F7A5C] hover:bg-[#185A44]">
          {todayRecipe.category}
        </Badge>
        {isPremium && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 rounded-full"
          >
            <Heart className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Recipe Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-[#1F7A5C]" />
            <div className="text-2xl font-bold text-gray-900">
              {todayRecipe.prepTime}
            </div>
            <div className="text-sm text-gray-600">Priprema</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-gray-900">
              {todayRecipe.calories}
            </div>
            <div className="text-sm text-gray-600">Kalorija</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {todayRecipe.protein}g
            </div>
            <div className="text-sm text-gray-600">Proteini</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UtensilsCrossed className="w-6 h-6 mx-auto mb-2 text-[#1F7A5C]" />
            <div className="text-sm font-bold text-gray-900">
              {todayRecipe.difficulty}
            </div>
            <div className="text-xs text-gray-600">Težina</div>
          </CardContent>
        </Card>
      </div>

      {/* Recipe Details */}
      <Card>
        <CardHeader>
          <CardTitle>Sastojci</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#1F7A5C] rounded-full"></span>
              200g losos filea
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#1F7A5C] rounded-full"></span>
              1 avokado
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#1F7A5C] rounded-full"></span>
              100g quinoe
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#1F7A5C] rounded-full"></span>
              Limun, so, biber
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priprema</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Skuvaj quinou prema uputstvu na pakovanju.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>Začini losos sa solju, biberom i limunom.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>Peci losos na tiganju 4-5 minuta sa svake strane.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#1F7A5C] text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>Servirati sa quinoom i narezanim avokadom.</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[#1F7A5C]" />
                  <span className="text-sm text-gray-600">
                    {new Date().toLocaleDateString("sr-Latn-RS", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {todayRecipe.title}
                </h1>
                <p className="text-gray-600">{todayRecipe.description}</p>
              </div>
            </div>

            {!isPremium ? (
              <FeatureLock
                title="Otkljucaj Kompletan Recept"
                description="Upgrade na Premium za pristup kompletnom receptu sa sastojcima, instrukcijama i nutritivnim vrednostima."
                features={[
                  "Kompletan recept sa svim sastojcima",
                  "Detaljne instrukcije korak-po-korak",
                  "Nutritivne vrednosti i makronutrijenti",
                  "Mogućnost čuvanja u favorite",
                  "Pristup istoriji recepata dana",
                ]}
              >
                {recipeContent}
              </FeatureLock>
            ) : (
              recipeContent
            )}

            {isPremium && (
              <div className="flex gap-4">
                <Button className="flex-1 bg-[#1F7A5C] hover:bg-[#185A44]">
                  <Heart className="w-4 h-4 mr-2" />
                  Dodaj u Favorite
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Dodaj u Meal Plan
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
