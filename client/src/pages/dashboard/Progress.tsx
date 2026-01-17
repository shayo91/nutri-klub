import { useState, useEffect } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Scale,
  Droplet,
  Utensils,
  TrendingDown,
  TrendingUp,
  Award,
  Target,
  Plus,
  Calendar,
  Loader2,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeightEntry {
  id: number;
  date: string;
  weight: string;
  notes?: string;
  mood?: string;
  energyLevel?: number;
}

interface MealEntry {
  id: number;
  date: string;
  mealType: string;
  mealName?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

interface Stats {
  latestWeight: string | null;
  weightChange: number | null;
  streaks: any[];
}

export default function Progress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogWeightOpen, setIsLogWeightOpen] = useState(false);
  const [isLogWaterOpen, setIsLogWaterOpen] = useState(false);

  // Form states
  const [weightData, setWeightData] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    notes: "",
    mood: "good",
    energyLevel: 3,
  });

  const [waterData, setWaterData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "250",
  });

  const isPremium = user?.role === "premium" || user?.role === "admin";

  useEffect(() => {
    fetchWeightHistory();
    fetchStats();
  }, []);

  async function fetchWeightHistory() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tracking/weight?limit=30", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch weight history");

      const data = await response.json();
      setWeights(data.weights);
    } catch (error) {
      console.error("Error fetching weight:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch("/api/tracking/stats", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function handleLogWeight(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/tracking/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(weightData),
      });

      if (!response.ok) throw new Error("Failed to log weight");

      toast({
        title: "Uspešno!",
        description: "Težina je zabeležena.",
      });

      setIsLogWeightOpen(false);
      fetchWeightHistory();
      fetchStats();

      // Reset form
      setWeightData({
        date: new Date().toISOString().split("T")[0],
        weight: "",
        notes: "",
        mood: "good",
        energyLevel: 3,
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Nije moguće zabeležiti težinu.",
        variant: "destructive",
      });
    }
  }

  async function handleLogWater(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/tracking/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(waterData),
      });

      if (!response.ok) throw new Error("Failed to log water");

      toast({
        title: "Uspešno!",
        description: `Dodato ${waterData.amount}ml vode.`,
      });

      setIsLogWaterOpen(false);
    } catch (error) {
      toast({
        title: "Greška",
        description: "Nije moguće zabeležiti vodu.",
        variant: "destructive",
      });
    }
  }

  // Prepare chart data
  const chartData = weights
    .slice()
    .reverse()
    .map((w) => ({
      date: new Date(w.date).toLocaleDateString("sr-RS", { day: "numeric", month: "short" }),
      weight: parseFloat(w.weight),
    }));

  const weightStreak = stats?.streaks?.find((s: any) => s.streakType === "weight_log");
  const waterStreak = stats?.streaks?.find((s: any) => s.streakType === "water");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Praćenje Napretka</h1>
                <p className="text-gray-600">
                  Prati svoju težinu, vodu i obroke za najbolje rezultate.
                </p>
              </div>
            </div>

            {/* Premium Badge */}
            {isPremium && (
              <Badge className="bg-[#1F7A5C]">Premium - Svi chart-ovi i insights!</Badge>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Current Weight */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Trenutna Težina</CardTitle>
                  <Scale className="w-4 h-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.latestWeight ? `${stats.latestWeight} kg` : "N/A"}
                  </div>
                  {stats && stats.weightChange !== null && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      {stats.weightChange > 0 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-red-500" />
                          <span className="text-red-500">+{stats.weightChange.toFixed(1)} kg</span>
                        </>
                      ) : stats.weightChange < 0 ? (
                        <>
                          <TrendingDown className="w-3 h-3 text-green-500" />
                          <span className="text-green-500">{stats.weightChange.toFixed(1)} kg</span>
                        </>
                      ) : (
                        <span>Bez promene</span>
                      )}
                      <span className="ml-1">(30 dana)</span>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Weight Streak */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Streak - Težina</CardTitle>
                  <Award className="w-4 h-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {weightStreak?.currentStreak || 0} 🔥
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Najduži: {weightStreak?.longestStreak || 0} dana
                  </p>
                </CardContent>
              </Card>

              {/* Water Streak */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Streak - Voda</CardTitle>
                  <Droplet className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {waterStreak?.currentStreak || 0} 💧
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Najduži: {waterStreak?.longestStreak || 0} dana
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Brze Akcije</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Dialog open={isLogWeightOpen} onOpenChange={setIsLogWeightOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Scale className="w-4 h-4 mr-2" />
                        Težina
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Zapiši Težinu</DialogTitle>
                        <DialogDescription>
                          Zabeleži svoju težinu i kako se osećaš danas.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleLogWeight} className="space-y-4">
                        <div>
                          <Label htmlFor="date">Datum</Label>
                          <Input
                            id="date"
                            type="date"
                            value={weightData.date}
                            onChange={(e) =>
                              setWeightData({ ...weightData, date: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Težina (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="75.5"
                            value={weightData.weight}
                            onChange={(e) =>
                              setWeightData({ ...weightData, weight: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="mood">Raspoloženje</Label>
                          <Select
                            value={weightData.mood}
                            onValueChange={(value) =>
                              setWeightData({ ...weightData, mood: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="great">Odlično 😁</SelectItem>
                              <SelectItem value="good">Dobro 😊</SelectItem>
                              <SelectItem value="okay">OK 😐</SelectItem>
                              <SelectItem value="bad">Loše 😔</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="energyLevel">
                            Nivo Energije: {weightData.energyLevel}/5
                          </Label>
                          <Input
                            id="energyLevel"
                            type="range"
                            min="1"
                            max="5"
                            value={weightData.energyLevel}
                            onChange={(e) =>
                              setWeightData({
                                ...weightData,
                                energyLevel: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Beleške (opciono)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Kako se osećaš?"
                            value={weightData.notes}
                            onChange={(e) =>
                              setWeightData({ ...weightData, notes: e.target.value })
                            }
                          />
                        </div>
                        <Button type="submit" className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
                          Zapiši
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isLogWaterOpen} onOpenChange={setIsLogWaterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Droplet className="w-4 h-4 mr-2" />
                        Voda
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Zapiši Vodu</DialogTitle>
                        <DialogDescription>
                          Koliko vode si popio danas?
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleLogWater} className="space-y-4">
                        <div>
                          <Label htmlFor="waterAmount">Količina (ml)</Label>
                          <Select
                            value={waterData.amount}
                            onValueChange={(value) =>
                              setWaterData({ ...waterData, amount: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="250">250ml (čaša)</SelectItem>
                              <SelectItem value="500">500ml (flaša)</SelectItem>
                              <SelectItem value="750">750ml</SelectItem>
                              <SelectItem value="1000">1L</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                          <Droplet className="w-4 h-4 mr-2" />
                          Dodaj Vodu
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Weight Chart */}
            {isPremium ? (
              <Card>
                <CardHeader>
                  <CardTitle>Grafik Težine (Poslednjih 30 dana)</CardTitle>
                  <CardDescription>
                    Vizuelizacija tvog napretka tokom poslednja meseca.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#1F7A5C]" />
                    </div>
                  ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke="#1F7A5C"
                          strokeWidth={2}
                          dot={{ fill: "#1F7A5C" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-600">
                      Nema podataka za prikaz. Započni praćenje težine!
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center bg-white p-6 rounded-lg shadow-lg">
                    <Target className="w-12 h-12 mx-auto mb-4 text-[#1F7A5C]" />
                    <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
                    <p className="text-gray-600 mb-4">
                      Upgrade za pristup naprednim chart-ovima i AI insights!
                    </p>
                    <Button className="bg-[#1F7A5C] hover:bg-[#185A44]">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Grafik Težine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-gray-100 blur-sm"></div>
                </CardContent>
              </Card>
            )}

            {/* Weight History */}
            <Card>
              <CardHeader>
                <CardTitle>Istorija Težine</CardTitle>
                <CardDescription>Tvoje poslednje merenja težine.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1F7A5C]" />
                  </div>
                ) : weights.length > 0 ? (
                  <div className="space-y-3">
                    {weights.slice(0, 5).map((weight) => (
                      <div
                        key={weight.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{weight.weight} kg</p>
                          <p className="text-sm text-gray-600">
                            {new Date(weight.date).toLocaleDateString("sr-RS", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          {weight.notes && (
                            <p className="text-sm text-gray-500 mt-1">{weight.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {weight.mood && (
                            <span className="text-xl">
                              {weight.mood === "great" && "😁"}
                              {weight.mood === "good" && "😊"}
                              {weight.mood === "okay" && "😐"}
                              {weight.mood === "bad" && "😔"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    Nema zabeleženih merenja. Klikni "Težina" da započneš!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
