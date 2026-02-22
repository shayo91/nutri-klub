/**
 * Struktura sedmičnog plana ishrane (dan × obroci, kalorije).
 * Admin kreira u tabeli; korisnik vidi u Moj plan.
 */

export const DAY_NAMES = [
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
  "Nedelja",
] as const;

export const MEAL_LABELS = [
  "Doručak (obrok 1)",
  "Ručak (obrok 2)",
  "Večera (obrok 3)",
  "Užina (obrok 4)",
] as const;

export interface MealSlot {
  name: string;
  calories: number | null;
}

export interface DayPlanRow {
  dayName: string;
  meals: MealSlot[];
}

export interface WeeklyPlanData {
  weekLabel?: string;
  dailyCalorieTarget?: number;
  days: DayPlanRow[];
}

export function createEmptyPlan(mealsPerDay: number = 3): WeeklyPlanData {
  return {
    weekLabel: "",
    dailyCalorieTarget: 1800,
    days: DAY_NAMES.map((dayName) => ({
      dayName,
      meals: Array.from({ length: mealsPerDay }, () => ({
        name: "",
        calories: null,
      })),
    })),
  };
}

export function isStructuredPlan(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed?.days) && parsed.days.length === 7;
  } catch {
    return false;
  }
}

export function parsePlanContent(content: string): WeeklyPlanData | null {
  if (!isStructuredPlan(content)) return null;
  return JSON.parse(content) as WeeklyPlanData;
}

export function dayTotalCalories(day: DayPlanRow): number {
  return day.meals.reduce(
    (sum, m) => sum + (m.calories != null ? m.calories : 0),
    0
  );
}
