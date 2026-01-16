import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, BookOpen, Utensils, MessageSquare, Users, TrendingUp, Crown } from "lucide-react";

export default function Dashboard() {
  const { user, logout, isPremium } = useAuth();
  const { data: subscription, isLoading } = useSubscription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Nutri Klub" className="h-10" />
              <div>
                <h1 className="text-2xl font-bold text-[#8B4513]">
                  Dobrodošli, {user?.firstName || "Korisnik"}!
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant={isPremium ? "default" : "secondary"}>
                    {isPremium ? "Premium" : "Free Trial"}
                  </Badge>
                  {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Odjava
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upgrade Banner for Free Users */}
        {!isPremium && (
          <Alert className="mb-6 bg-gradient-to-r from-[#8B4513] to-[#6D3710] text-white border-none">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Probajte Premium besplatno 7 dana!</strong> Neograničeni recepti, AI asistent, i više.
              <Button variant="secondary" size="sm" className="ml-4">
                Aktiviraj Trial
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Stats for Free Users */}
        {!isPremium && subscription?.usageStats && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Vaša potrošnja (Free Trial)</CardTitle>
              <CardDescription>
                Nadogradite na Premium za neograničen pristup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {subscription.usageStats.recipe_view.current}/{subscription.usageStats.recipe_view.limit}
                  </div>
                  <div className="text-sm text-muted-foreground">Recepti</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {subscription.usageStats.ai_message.current}/{subscription.usageStats.ai_message.limit}
                  </div>
                  <div className="text-sm text-muted-foreground">AI Poruke</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {subscription.usageStats.ebook_download.current}/{subscription.usageStats.ebook_download.limit}
                  </div>
                  <div className="text-sm text-muted-foreground">E-bookovi</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Utensils className="h-8 w-8 text-[#8B4513] mb-2" />
              <CardTitle>Recepti</CardTitle>
              <CardDescription>
                {isPremium ? "500+ zdravih recepata" : "3 demo recepta"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Pregledaj</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-[#8B4513] mb-2" />
              <CardTitle>E-bookovi</CardTitle>
              <CardDescription>
                {isPremium ? "15+ premium e-bookova" : "1 besplatan e-book"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Preuzmi</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-[#8B4513] mb-2" />
              <CardTitle>Recept Dana</CardTitle>
              <CardDescription>
                Dnevna inspiracija za obrok
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Pogledaj</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-[#8B4513] mb-2" />
              <CardTitle>AI Asistent</CardTitle>
              <CardDescription>
                {isPremium ? "Neograničeno AI saveta" : "2 probne poruke"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Započni Chat</Button>
            </CardContent>
          </Card>

          {isPremium && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Users className="h-8 w-8 text-[#8B4513] mb-2" />
                  <CardTitle>Zajednica</CardTitle>
                  <CardDescription>
                    Podeli napredak i inspiriši druge
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Pridruži se</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-[#8B4513] mb-2" />
                  <CardTitle>Napredak</CardTitle>
                  <CardDescription>
                    Prati svoju transformaciju
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Vidi Statistiku</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
