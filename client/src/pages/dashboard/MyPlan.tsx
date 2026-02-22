import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureLock } from "@/components/dashboard/FeatureLock";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  Utensils,
  Dumbbell,
  Heart
} from "lucide-react";

export default function MyPlan() {
  const { user } = useAuth();
  const isPremium = user?.role === "premium" || user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Moj Plan</h1>
              <p className="text-gray-600 mt-2">
                Personalizovani plan ishrane i aktivnosti
              </p>
            </div>

            {!isPremium ? (
              <FeatureLock
                title="Personalizovani Plan Ishrane"
                description="Kupi Premium ili Plan paket da dobiješ personalizovani plan ishrane prilagođen tvojim ciljevima!"
                features={[
                  "🎯 Personalizovani jelovnik na osnovu tvojih ciljeva",
                  "📅 Sedmični plan obroka sa receptima",
                  "🔥 Praćenje kalorija i makronutrijenata",
                  "📊 Napredak i statistika u realnom vremenu",
                  "🏆 Streak sistem za motivaciju",
                  "💬 Prioritetna podrška nutricionist"
                ]}
              >
                {/* Dummy content for blur effect */}
                <div className="space-y-6">
                  <Card className="bg-gray-200 h-48"></Card>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gray-200 h-32"></Card>
                    <Card className="bg-gray-200 h-32"></Card>
                    <Card className="bg-gray-200 h-32"></Card>
                  </div>
                  <Card className="bg-gray-200 h-96"></Card>
                </div>
              </FeatureLock>
            ) : (
              <>

            {/* Current Week Overview */}
            <Card className="bg-gradient-to-r from-[#1F7A5C] to-[#185A44] text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl mb-2">
                      Nedelja 1 - U toku
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      18. januar - 24. januar 2026
                    </CardDescription>
                  </div>
                  <Calendar className="w-12 h-12 text-white/80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">4/7</div>
                    <div className="text-sm text-white/80">Dana završeno</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">18</div>
                    <div className="text-sm text-white/80">Obroka planirano</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">85%</div>
                    <div className="text-sm text-white/80">Napredak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">7🔥</div>
                    <div className="text-sm text-white/80">Dnevni streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-[#1F7A5C]" />
                    <div>
                      <CardTitle>Cilj težine</CardTitle>
                      <CardDescription>-5 kg do marta</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Trenutno: 78 kg</span>
                      <span className="font-semibold text-[#1F7A5C]">Cilj: 73 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#1F7A5C] h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                    <p className="text-xs text-gray-600">2 kg izgubljeno</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Utensils className="w-8 h-8 text-orange-600" />
                    <div>
                      <CardTitle>Dnevni kalorije</CardTitle>
                      <CardDescription>1800 kcal plan</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Danas: 1450 kcal</span>
                      <Badge variant="outline" className="text-green-600">-350</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                    <p className="text-xs text-gray-600">Odlično! Ispod cilja</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Dumbbell className="w-8 h-8 text-blue-600" />
                    <div>
                      <CardTitle>Aktivnost</CardTitle>
                      <CardDescription>3x nedeljno</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ove nedelje: 2/3</span>
                      <Badge variant="outline">1 preostala</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "66%" }}></div>
                    </div>
                    <p className="text-xs text-gray-600">Jos 1 trening!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Meal Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Plan Obroka - Ova Nedelja</CardTitle>
                    <CardDescription>
                      Personalizovan jelovnik prema tvojim ciljevima
                    </CardDescription>
                  </div>
                  <Button className="bg-[#1F7A5C] hover:bg-[#185A44]">
                    Prilagodi Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"].map((day, index) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[80px]">
                          <div className="text-sm font-semibold text-gray-900">{day}</div>
                          <div className="text-xs text-gray-500">Dan {index + 1}</div>
                        </div>
                        <div className="flex gap-2">
                          {index < 4 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <div className="text-sm font-medium">
                              {index < 4 ? "Završeno" : "Planirano"}
                            </div>
                            <div className="text-xs text-gray-600">
                              3 obroka • ~1800 kcal
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Vidi Detalje
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Tips */}
            <Card className="border-l-4 border-l-[#1F7A5C]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <div>
                    <CardTitle>Saveti za ovu nedelju</CardTitle>
                    <CardDescription>Prilagođeno prema tvom planu</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Pij najmanje 2L vode dnevno za bolje varenje</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Izbegavaj kasne večere - poslednji obrok do 20h</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Fokusiraj se na proteine za doručak (25g+)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
