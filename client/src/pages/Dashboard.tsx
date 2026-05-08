import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { QuickStats } from '@/components/dashboard/QuickStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  BookMarked,
  UtensilsCrossed,
  Bot,
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  Search,
  Settings as SettingsIcon,
} from 'lucide-react';

export default function Dashboard() {
  const { user, isPremium } = useAuth();

  const featureCards = [
    {
      title: "Recepti",
      description: "Pristup 500+ zdravih recepata",
      icon: <BookOpen className="w-10 h-10 text-[#1F7A5C]" />,
      link: "/dashboard/recipes",
      badge: null,
      color: "from-blue-50 to-blue-100",
    },
    {
      title: "E-bookovi",
      description: isPremium
        ? "Premium e-bookovi i vodiči"
        : "1 besplatan mini vodič",
      icon: <BookMarked className="w-10 h-10 text-orange-600" />,
      link: "/dashboard/ebooks",
      badge: isPremium ? "15+" : "Besplatno",
      color: "from-orange-50 to-orange-100",
    },
    {
      title: "Recept Dana",
      description: "Dnevna inspiracija za obroke",
      icon: <UtensilsCrossed className="w-10 h-10 text-purple-600" />,
      link: "/dashboard/recipe-of-the-day",
      badge: "Novo",
      color: "from-purple-50 to-purple-100",
    },
    {
      title: "AI Asistent",
      description: isPremium
        ? "Neograničen AI chat"
        : "2 probne poruke besplatno",
      icon: <Bot className="w-10 h-10 text-teal-600" />,
      link: "/dashboard/ai-assistant",
      badge: "NEW",
      color: "from-teal-50 to-teal-100",
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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dobro došli,{' '}
                {[user?.firstName, user?.lastName].filter(Boolean).join(' ')
                  || user?.email?.split('@')[0]
                  || 'korisniče'}
                !
              </h1>
              <p className="text-gray-600 mt-2">
                {isPremium
                  ? 'Evo pregleda vašeg nutritivnog okruženja — recepti, plan i praćenje na jednom mjestu.'
                  : 'Počnite sa besplatnim sadržajem; premium otvara sve alate bez ograničenja.'}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-5 h-5 shrink-0 text-[#1F7A5C]" />
                <span>
                  Nedeljni fokus: prijavite obroke u Napretku ili pronađite recept za večeras.
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/dashboard/search">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Search className="w-4 h-4" />
                    Pretraži recepte
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" size="sm" className="gap-2">
                    <SettingsIcon className="w-4 h-4" />
                    Postavke
                  </Button>
                </Link>
              </div>
            </div>

            <QuickStats />

            
            {/* Moj Plan - Full Width (odmah ispod welcome) */}
            <div className="relative">
              <Link href="/dashboard/my-plan">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-[#1F7A5C] to-[#185A44] text-white border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Target className="w-8 h-8 text-white" />
                      <div>
                        <CardTitle className="text-white">Moj Plan</CardTitle>
                        <CardDescription className="text-white/80">
                          Personalizovani plan ishrane
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">Nedelja 1</p>
                        <p className="text-sm text-white/80">4/7 dana završeno 🔥</p>
                      </div>
                      <Button className="bg-white text-[#1F7A5C] hover:bg-gray-100">
                        Otvori
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {/* Blur overlay for free users */}
              {!isPremium && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-lg pointer-events-none"></div>
              )}
            </div>

            {/* Main Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((feature, index) => (
                <Link key={index} href={feature.link}>
                  <Card className={`hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full bg-gradient-to-br ${feature.color} border-0`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
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
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 shadow-sm">
                        {isPremium ? "Otvori" : "Isprobaj"}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Napredak - Full Width (za premium i free sa blur-om) */}
            <div className="relative">
              <Link href="/dashboard/progress">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-[#1F7A5C]" />
                      <div>
                        <CardTitle>Napredak</CardTitle>
                        <CardDescription>Prati svoju transformaciju</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-[#1F7A5C]">85%</p>
                        <p className="text-sm text-gray-600">Nedeljni cilj</p>
                      </div>
                      <Button variant="outline">Vidi Više</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Blur overlay for free users */}
              {!isPremium && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-lg pointer-events-none"></div>
              )}
            </div>

            {/* Motivational Card */}
            <Card className="border-l-4 border-l-[#1F7A5C] bg-gradient-to-r from-gray-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-10 h-10 text-[#FFD700]" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      💪 Tvoja transformacija počinje danas!
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {isPremium 
                        ? "Iskoristi sve premium funkcije i ostvari svoje ciljeve brže." 
                        : "Isprobaj naše besplatne funkcije i vidi kako možemo pomoći."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isPremium && (
              <UpgradeBanner variant="full" />
            )}            
          </div>
        </main>
      </div>
    </div>
  );
}
