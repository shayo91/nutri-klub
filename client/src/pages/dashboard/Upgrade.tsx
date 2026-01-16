import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

export default function Upgrade() {
  const premiumFeatures = [
    "500+ zdravih recepata sa detaljnim instrukcijama",
    "15+ premium e-bookova (meal prep, keto, vodici)",
    "Neograničen AI nutritionist asistent",
    "7-dnevni meal planner sa drag & drop",
    "Auto-generisana shopping lista",
    "Tracking napretka (težina, merenja, photos)",
    "Habit trackers (voda, san, energija)",
    "Achievement sistem i streaks",
    "Pristup zajednici i weekly challenges",
    "Personalizovane preporuke recepata",
    "Weekly progress report",
    "Prioritetna email podrška",
    "Referral program (1 mesec FREE po referralu)",
    "Bez reklama",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-10 h-10 text-[#FFD700]" />
                <h1 className="text-4xl font-bold text-gray-900">
                  Upgrade na Premium
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-4">
                Otkljucaj sve funkcionalnosti i ostvari svoje ciljeve brže
              </p>
              <Badge className="bg-[#FFD700] text-gray-900 hover:bg-[#FFD700] text-lg px-4 py-2">
                🎁 7 dana besplatno • Otkazi bilo kada
              </Badge>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Monthly Plan */}
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Mesečna Pretplata</CardTitle>
                    <Zap className="w-6 h-6 text-blue-500" />
                  </div>
                  <CardDescription>Fleksibilnost bez obaveze</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">4€</span>
                      <span className="text-gray-600">/mesec</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Naplaćuje se mesečno • Otkazi bilo kada
                    </p>
                  </div>

                  <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800">
                    Započni 7-dnevni trial
                  </Button>

                  <div className="pt-4 space-y-3">
                    {premiumFeatures.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 pt-2">+ sve ostale funkcionalnosti</p>
                  </div>
                </CardContent>
              </Card>

              {/* Yearly Plan - RECOMMENDED */}
              <Card className="relative overflow-hidden border-[#1F7A5C] border-2 shadow-xl">
                <div className="absolute top-0 right-0 bg-[#FFD700] text-gray-900 px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  UŠTEDIŠ 48€
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Godišnja Pretplata</CardTitle>
                    <Crown className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <CardDescription>Najbolja vrednost - uštedi 58%!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-[#1F7A5C]">35€</span>
                      <span className="text-gray-600">/godišnje</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg line-through text-gray-400">83€</span>
                      <Badge className="bg-green-500 hover:bg-green-600">-58%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Samo 2.92€/mesec • 12 meseci pristupa
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#1F7A5C] to-[#185A44] hover:opacity-90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Započni 7-dnevni trial
                  </Button>

                  <div className="pt-4 space-y-3">
                    {premiumFeatures.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-start gap-2 pt-2 border-t">
                      <Sparkles className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-[#1F7A5C]">
                        + Ekskluzivni godišnji bonusi
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Features List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Sve što dobijate sa Premium</CardTitle>
                <CardDescription>
                  Kompletna lista funkcionalnosti i benefita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ / Guarantee */}
            <div className="bg-gradient-to-br from-[#ECF8F2] to-[#E8F5F0] rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Bez Rizika - 7 Dana Besplatno
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                Isprobaj Premium kompletno besplatno 7 dana. Ako nisi zadovoljan, 
                jednostavno otkaži pre kraja trial perioda i neće te biti naplaćeno. 
                Bez skrivenih troškova, bez obaveza.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  ✓ Bez kreditne kartice za trial
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  ✓ Otkazi bilo kada jednim klikom
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  ✓ Instant aktivacija
                </Badge>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
