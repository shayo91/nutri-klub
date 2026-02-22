import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RecipeFilters as RecipeFiltersType } from "@/lib/types";

interface RecipeFiltersProps {
  filters: RecipeFiltersType;
  onFiltersChange: (filters: RecipeFiltersType) => void;
  isPremium: boolean;
}

const CATEGORIES = [
  { value: "breakfast", label: "Doručak" },
  { value: "lunch", label: "Ručak" },
  { value: "dinner", label: "Večera" },
  { value: "snack", label: "Užina" },
  { value: "dessert", label: "Dezert" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Lako" },
  { value: "medium", label: "Srednje" },
  { value: "hard", label: "Teško" },
];

const DIETARY_TAGS = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "low-carb",
  "high-protein",
];

export function RecipeFilters({
  filters,
  onFiltersChange,
  isPremium,
}: RecipeFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [isOpen, setIsOpen] = useState(false);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    onFiltersChange({ ...filters, search: value });
  }

  function handleFilterChange(key: keyof RecipeFiltersType, value: any) {
    onFiltersChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    setSearchQuery("");
    onFiltersChange({});
  }

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof RecipeFiltersType] !== undefined && key !== "search"
  ).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={isPremium ? "Pretraži recepte..." : "Pretraga dostupna samo za Premium"}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={!isPremium}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filteri
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Napredni Filteri</SheetTitle>
              <SheetDescription>
                {isPremium ? "Filtrirajte recepte prema vašim preferencijama" : "Napredni filteri dostupni samo za Premium korisnike"}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Category */}
              <div>
                <Label>Kategorija</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange("category", value)}
                  disabled={!isPremium}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sve kategorije" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sve kategorije</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div>
                <Label>Težina</Label>
                <Select
                  value={filters.difficulty}
                  onValueChange={(value) => handleFilterChange("difficulty", value)}
                  disabled={!isPremium}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sve težine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sve težine</SelectItem>
                    {DIFFICULTIES.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Prep Time */}
              <div>
                <Label>
                  Maksimalno vreme pripreme: {filters.maxPrepTime || 120} min
                </Label>
                <Slider
                  value={[filters.maxPrepTime || 120]}
                  onValueChange={([value]) => handleFilterChange("maxPrepTime", value)}
                  max={120}
                  step={5}
                  disabled={!isPremium}
                  className="mt-2"
                />
              </div>

              {/* Max Calories */}
              <div>
                <Label>
                  Maksimalno kalorija: {filters.maxCalories || 1000} kcal
                </Label>
                <Slider
                  value={[filters.maxCalories || 1000]}
                  onValueChange={([value]) => handleFilterChange("maxCalories", value)}
                  max={1000}
                  step={50}
                  disabled={!isPremium}
                  className="mt-2"
                />
              </div>

              {/* Min Protein */}
              <div>
                <Label>
                  Minimalno proteina: {filters.minProtein || 0}g
                </Label>
                <Slider
                  value={[filters.minProtein || 0]}
                  onValueChange={([value]) => handleFilterChange("minProtein", value)}
                  max={100}
                  step={5}
                  disabled={!isPremium}
                  className="mt-2"
                />
              </div>

              {/* Dietary Tags */}
              <div>
                <Label>Dijetetske preferencije</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DIETARY_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        filters.dietaryTags?.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        if (!isPremium) return;
                        const current = filters.dietaryTags || [];
                        const updated = current.includes(tag)
                          ? current.filter((t) => t !== tag)
                          : [...current, tag];
                        handleFilterChange("dietaryTags", updated);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Očisti
                </Button>
                <Button
                  className="flex-1 bg-[#1F7A5C] hover:bg-[#185A44]"
                  onClick={() => setIsOpen(false)}
                >
                  Primeni
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary">
              Kategorija: {CATEGORIES.find((c) => c.value === filters.category)?.label}
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => handleFilterChange("category", undefined)}
              />
            </Badge>
          )}
          {filters.difficulty && (
            <Badge variant="secondary">
              Težina: {DIFFICULTIES.find((d) => d.value === filters.difficulty)?.label}
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => handleFilterChange("difficulty", undefined)}
              />
            </Badge>
          )}
          {filters.maxPrepTime && filters.maxPrepTime < 120 && (
            <Badge variant="secondary">
              Max vreme: {filters.maxPrepTime} min
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => handleFilterChange("maxPrepTime", undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
