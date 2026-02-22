import { useState, useEffect, useMemo } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Loader2,
  Search,
  X,
  Eye,
  Calendar,
  UtensilsCrossed,
  Plus,
} from "lucide-react";
import {
  type WeeklyPlanData,
  createEmptyPlan,
  dayTotalCalories,
  MEAL_LABELS,
} from "@/lib/plan-types";

interface UserOption {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

function userDisplayName(u: UserOption): string {
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return name || u.email;
}

interface RecipeSuggestion {
  id: number;
  title: string;
  calories: number;
}

const MEALS_PER_DAY = 3;

export default function AdminPlans() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [planData, setPlanData] = useState<WeeklyPlanData>(() =>
    createEmptyPlan(MEALS_PER_DAY)
  );
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [suggestCell, setSuggestCell] = useState<{
    dayIndex: number;
    mealIndex: number;
  } | null>(null);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [suggestRecipes, setSuggestRecipes] = useState<RecipeSuggestion[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = userDisplayName(u).toLowerCase();
      const email = u.email.toLowerCase();
      return email.includes(q) || name.includes(q);
    });
  }, [users, userSearch]);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Forbidden");
        return res.json();
      })
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, []);

  const [recipeSearchDebounced, setRecipeSearchDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setRecipeSearchDebounced(recipeSearch), 300);
    return () => clearTimeout(t);
  }, [recipeSearch]);

  useEffect(() => {
    if (!suggestCell) return;
    setLoadingRecipes(true);
    const params = new URLSearchParams({
      page: "1",
      limit: "20",
      ...(recipeSearchDebounced.trim() && { search: recipeSearchDebounced.trim() }),
    });
    fetch(`/api/recipes?${params}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { recipes: [] }))
      .then((data) => {
        const list = (data.recipes || []).slice(0, 15).map((r: { id: number; title: string; calories?: number }) => ({
          id: r.id,
          title: r.title,
          calories: r.calories ?? 0,
        }));
        setSuggestRecipes(list);
      })
      .catch(() => setSuggestRecipes([]))
      .finally(() => setLoadingRecipes(false));
  }, [suggestCell, recipeSearchDebounced]);

  function openSuggest(dayIndex: number, mealIndex: number) {
    setSuggestCell({ dayIndex, mealIndex });
    setRecipeSearch("");
    setSuggestRecipes([]);
  }

  function applySuggestion(recipe: RecipeSuggestion) {
    if (!suggestCell) return;
    setPlanData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as WeeklyPlanData;
      const day = next.days[suggestCell.dayIndex];
      if (day && day.meals[suggestCell.mealIndex]) {
        day.meals[suggestCell.mealIndex] = {
          name: recipe.title,
          calories: recipe.calories,
        };
      }
      return next;
    });
    setSuggestCell(null);
  }

  function updateMeal(
    dayIndex: number,
    mealIndex: number,
    field: "name" | "calories",
    value: string | number
  ) {
    setPlanData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as WeeklyPlanData;
      const day = next.days[dayIndex];
      if (!day || !day.meals[mealIndex]) return prev;
      if (field === "name") day.meals[mealIndex].name = String(value);
      if (field === "calories") {
        const n = typeof value === "string" ? parseInt(value, 10) : value;
        day.meals[mealIndex].calories = Number.isNaN(n) ? null : n;
      }
      return next;
    });
  }

  function setDailyTarget(value: number) {
    setPlanData((prev) => ({ ...prev, dailyCalorieTarget: value }));
  }

  function setWeekLabel(value: string) {
    setPlanData((prev) => ({ ...prev, weekLabel: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) {
      toast({
        title: "Greška",
        description: "Odaberi korisnika.",
        variant: "destructive",
      });
      return;
    }
    const planTitle = title.trim() || `Plan ishrane – ${planData.weekLabel || "Nedelja"}`;
    const content = JSON.stringify(planData);
    setSubmitting(true);
    fetch("/api/admin/assigned-plans", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.id,
        title: planTitle,
        content,
        weekLabel: planData.weekLabel || undefined,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Nije moguće dodijeliti plan");
        return data;
      })
      .then(() => {
        toast({
          title: "Plan dodijeljen",
          description: "Korisnik će vidjeti plan u Moj plan.",
        });
        setSelectedUser(null);
        setUserSearch("");
        setPlanData(createEmptyPlan(MEALS_PER_DAY));
        setTitle("");
      })
      .catch((err) => {
        toast({
          title: "Greška",
          description: err.message || "Nije moguće dodijeliti plan.",
          variant: "destructive",
        });
      })
      .finally(() => setSubmitting(false));
  }

  const mealLabels = MEAL_LABELS.slice(0, MEALS_PER_DAY);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Personalizovani plan ishrane
              </h1>
              <p className="text-gray-600 mt-1">
                Kreiraj sedmični plan po danima i obrocima, unesi kalorije; korisnik vidi istu tabelu u Moj plan.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Kreiraj i dodijeli plan po sedmici
                </CardTitle>
                <CardDescription>
                  Pretraži korisnika, postavi nedelju i dnevni cilj kalorija, pa popuni tabelu (obrok + kcal). Koristi „Predloži” za brzo ubacivanje recepta iz baze.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Učitavanje korisnika...
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label>Korisnik</Label>
                      {selectedUser ? (
                        <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-input bg-muted/30 mt-1">
                          <span className="text-sm font-medium">
                            {userDisplayName(selectedUser)} ({selectedUser.email})
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(null);
                              setUserSearch("");
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              value={userSearch}
                              onChange={(e) => setUserSearch(e.target.value)}
                              placeholder="Pretraži po emailu ili imenu..."
                              className="pl-9"
                            />
                          </div>
                          {userSearch.trim() && (
                            <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border border-input bg-background divide-y">
                              {filteredUsers.length === 0 ? (
                                <li className="px-3 py-4 text-sm text-muted-foreground text-center">
                                  Nema rezultata
                                </li>
                              ) : (
                                filteredUsers.map((u) => (
                                  <li key={u.id}>
                                    <button
                                      type="button"
                                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                                      onClick={() => {
                                        setSelectedUser(u);
                                        setUserSearch("");
                                      }}
                                    >
                                      <span className="font-medium">{userDisplayName(u)}</span>
                                      <span className="text-muted-foreground ml-1">({u.email})</span>
                                    </button>
                                  </li>
                                ))
                              )}
                            </ul>
                          )}
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Nedelja (npr. 18.–24. januar 2026)</Label>
                        <Input
                          value={planData.weekLabel || ""}
                          onChange={(e) => setWeekLabel(e.target.value)}
                          placeholder="Nedelja 1, 18.–24. jan 2026"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Dnevni cilj kalorija (kcal)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={planData.dailyCalorieTarget ?? ""}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            setDailyTarget(Number.isNaN(v) ? 0 : v);
                          }}
                          placeholder="1800"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="title">Naslov plana (opciono)</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="npr. Plan ishrane – Nedelja 1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Plan obroka po danima</Label>
                        <span className="text-xs text-muted-foreground">
                          Obrok 1 = Doručak, 2 = Ručak, 3 = Večera
                        </span>
                      </div>
                      <div className="overflow-x-auto rounded-lg border border-input">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50 border-b">
                              <th className="text-left p-2 font-medium w-28">Dan</th>
                              {mealLabels.map((label, i) => (
                                <th key={i} className="text-left p-2 font-medium">
                                  Obrok {i + 1}
                                </th>
                              ))}
                              <th className="text-right p-2 font-medium w-24">Ukupno kcal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {planData.days.map((day, dayIndex) => (
                              <tr
                                key={day.dayName}
                                className="border-b last:border-0 hover:bg-muted/20"
                              >
                                <td className="p-2 font-medium align-top">
                                  {day.dayName}
                                </td>
                                {day.meals.map((meal, mealIndex) => (
                                  <td key={mealIndex} className="p-1 align-top">
                                    <div className="space-y-1">
                                      <Input
                                        className="h-8 text-xs"
                                        value={meal.name}
                                        onChange={(e) =>
                                          updateMeal(dayIndex, mealIndex, "name", e.target.value)
                                        }
                                        placeholder="Obrok..."
                                      />
                                      <div className="flex items-center gap-1">
                                        <Input
                                          type="number"
                                          min={0}
                                          className="h-8 w-20 text-xs"
                                          value={meal.calories ?? ""}
                                          onChange={(e) => {
                                            const v = e.target.value;
                                            updateMeal(
                                              dayIndex,
                                              mealIndex,
                                              "calories",
                                              v === "" ? "" : parseInt(v, 10)
                                            );
                                          }}
                                          placeholder="kcal"
                                        />
                                        <Popover
                                          open={
                                            suggestCell?.dayIndex === dayIndex &&
                                            suggestCell?.mealIndex === mealIndex
                                          }
                                          onOpenChange={(open) => {
                                            if (!open) setSuggestCell(null);
                                          }}
                                        >
                                          <PopoverTrigger asChild>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              className="h-8 px-2"
                                              onClick={() => openSuggest(dayIndex, mealIndex)}
                                            >
                                              <Plus className="w-3 h-3" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-72 p-2" align="start">
                                            <Input
                                              placeholder="Pretraži recept..."
                                              value={recipeSearch}
                                              onChange={(e) => setRecipeSearch(e.target.value)}
                                              className="mb-2"
                                            />
                                            {loadingRecipes ? (
                                              <p className="text-xs text-muted-foreground">Učitavanje...</p>
                                            ) : suggestRecipes.length === 0 ? (
                                              <p className="text-xs text-muted-foreground">
                                                Nema recepata. Unesi naziv ručno.
                                              </p>
                                            ) : (
                                              <ul className="max-h-48 overflow-y-auto space-y-1">
                                                {suggestRecipes.map((r) => (
                                                  <li key={r.id}>
                                                    <button
                                                      type="button"
                                                      className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-muted"
                                                      onClick={() => applySuggestion(r)}
                                                    >
                                                      {r.title} ({r.calories} kcal)
                                                    </button>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </div>
                                  </td>
                                ))}
                                <td className="p-2 text-right align-top font-medium text-[#1F7A5C]">
                                  {dayTotalCalories(day)} kcal
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#1F7A5C] hover:bg-[#185A44]"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Dodijeli plan
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Pregled kako korisnik vidi plan */}
            <Card className="border-[#1F7A5C]/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Pregled – kako korisnik vidi plan u Moj plan
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "Sakrij" : "Prikaži"}
                  </Button>
                </div>
              </CardHeader>
              {showPreview && (
                <CardContent className="pt-0">
                  <Card className="border border-dashed border-[#1F7A5C]/40 bg-white">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#1F7A5C]" />
                        <div>
                          <CardTitle className="text-lg">
                            {title.trim() || `Plan ishrane – ${planData.weekLabel || "Nedelja"}`}
                          </CardTitle>
                          <CardDescription>
                            {planData.weekLabel || "Nedelja"} · Cilj: {planData.dailyCalorieTarget || "–"} kcal/dan
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto rounded border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left p-2 font-medium">Dan</th>
                              {mealLabels.map((_, i) => (
                                <th key={i} className="text-left p-2 font-medium">
                                  Obrok {i + 1}
                                </th>
                              ))}
                              <th className="text-right p-2 font-medium">Ukupno kcal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {planData.days.map((day) => (
                              <tr key={day.dayName} className="border-t">
                                <td className="p-2 font-medium">{day.dayName}</td>
                                {day.meals.map((m, i) => (
                                  <td key={i} className="p-2">
                                    <div>{m.name || "–"}</div>
                                    {m.calories != null && m.calories > 0 && (
                                      <div className="text-xs text-muted-foreground">{m.calories} kcal</div>
                                    )}
                                  </td>
                                ))}
                                <td className="p-2 text-right font-medium text-[#1F7A5C]">
                                  {dayTotalCalories(day)} kcal
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
