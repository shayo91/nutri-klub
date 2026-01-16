import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeWidget } from "@/components/dashboard/WelcomeWidget";
import { QuickStats, MembershipStats } from "@/components/dashboard/QuickStats";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { UsageMeter } from "@/components/dashboard/UsageMeter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  BookMarked,
  UtensilsCrossed,
  Bot,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const { isPremium } = useAuth();
  const { data: subscription } = useSubscription();

  // Sample usage data for free tier
  const freeUsageLimits = [
    {
      feature: "Recepti",
      used: subscription?.usageStats?.recipe_view?.current || 0,
      limit: subscription?.usageStats?.recipe_view?.limit || 3,
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      description: "Preostalo demo recepata",
    },
    {
      feature: "AI Poruke",
      used: subscription?.usageStats?.ai_message?.current || 0,
      limit: subscription?.usageStats?.ai_message?.limit || 2,
      icon: <Bot className="w-4 h-4 text-purple-600" />,
      description: "Trial AI konverzacija",
    },
    {
      feature: "E-bookovi",
      used: subscription?.usageStats?.ebook_download?.current || 0,
      limit: subscription?.usageStats?.ebook_download?.limit || 1,
      icon: <BookMarked className="w-4 h-4 text-orange-600" />,
      description: "Besplatan mini e-book",
    },
  ];

  const featureCards = [
    {
      title: "Recepti",
      description: isPremium
        ? "Neograničen pristup 500+ zdravih recepata"
        : "Probaj 3 demo recepta",
      icon: <BookOpen className="w-8 h-8 text-[#1F7A5C]" />,
      link: "/dashboard/recipes",
      badge: isPremium ? null : "3 besplatna",
    },
    {
      title: "E-bookovi",
      description: isPremium
        ? "Pristup svim premium e-bookovima"
        : "1 besplatan mini vodič",
      icon: <BookMarked className="w-8 h-8 text-[#1F7A5C]" />,
      link: "/dashboard/ebooks",
      badge: isPremium ? "15+" : "1 besplatan",
    },
    {
      title: "Recept Dana",
      description: isPremium
        ? "Dnevna inspiracija za obroke"
        : "Preview recepta dana",
      icon: <UtensilsCrossed className="w-8 h-8 text-[#1F7A5C]" />,
      link: "/dashboard/recipe-of-the-day",
      badge: "Novo danas",
    },
    {
      title: "AI Asistent",
      description: isPremium
        ? "Neograničen AI chat za nutricionizam"
        : "2 probne AI poruke",
      icon: <Bot className="w-8 h-8 text-[#1F7A5C]" />,
      link: "/dashboard/ai-assistant",
      badge: isPremium ? null : "2 poruke",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Widget */}
            <WelcomeWidget />

            {/* Upgrade Banner (Free Users Only) */}
            {!isPremium && (
              <UpgradeBanner variant="full" dismissible />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <QuickStats />
              </div>
              <div>
                <MembershipStats
                  subscriptionType={isPremium ? "premium" : "free"}
                  daysLeft={7}
                />
              </div>
            </div>

            {/* Usage Meter for Free Users */}
            {!isPremium && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureCards.map((feature, index) => (
                      <Link key={index} href={feature.link}>
                        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              {feature.icon}
                              {feature.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {feature.badge}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
                              {isPremium ? "Otvori" : "Isprobaj"}
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Usage Meter Sidebar */}
                <div>
                  <UsageMeter limits={freeUsageLimits} daysLeft={7} />
                </div>
              </div>
            )}

            {/* Feature Cards for Premium Users */}
            {isPremium && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featureCards.map((feature, index) => (
                  <Link key={index} href={feature.link}>
                    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          {feature.icon}
                          {feature.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
                          Otvori
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {/* Additional Premium Features */}
                <Link href="/dashboard/community">
                  <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Users className="w-8 h-8 text-[#1F7A5C]" />
                        <Badge className="bg-[#FFD700] text-gray-900 hover:bg-[#FFD700]">
                          NEW
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">Zajednica</CardTitle>
                      <CardDescription className="text-sm">
                        Podeli napredak i inspiriši druge
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
                        Pridruži se
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/dashboard/progress">
                  <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-[#1F7A5C]" />
                      </div>
                      <CardTitle className="text-lg">Napredak</CardTitle>
                      <CardDescription className="text-sm">
                        Prati svoju transformaciju
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
                        Vidi Statistiku
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="bg-gradient-to-br from-[#ECF8F2] to-[#E8F5F0] border-[#1F7A5C]/20">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Award className="w-8 h-8 text-[#1F7A5C]" />
                      <Sparkles className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <CardTitle className="text-lg">Achievements</CardTitle>
                    <CardDescription className="text-sm">
                      Otkljucaj nagrade i bedževe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>7 dana streak! 🔥</span>
                    </div>
                  </CardContent>
                </Card>

                <Link href="/dashboard/meal-planner">
                  <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full bg-gradient-to-br from-[#1F7A5C] to-[#185A44] text-white border-0">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">Meal Planner</CardTitle>
                      <CardDescription className="text-white/90 text-sm">
                        Planiraj obroke za nedelju
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-white text-[#1F7A5C] hover:bg-gray-100">
                        Planiraj
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}

            {/* Coming Soon Section */}
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Uskoro dolaze nove funkcionalnosti!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Radimo na još amazing feature-ima za vas. Ostanite sa nama! 🚀
                </p>
                <Badge variant="secondary">Work in Progress</Badge>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
