import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Clock, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  calories: number;
  prepTime: number;
  cookTime: number;
  servings: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl: string;
  ingredients: any;
  instructions: any;
  dietaryTags: any;
  allergens: any;
}

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "lunch",
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "medium",
    calories: 400,
    protein: 25,
    carbs: 45,
    fats: 15,
    ingredients: [{ name: "", quantity: 0, unit: "g" }],
    instructions: [""],
    dietaryTags: [] as string[],
    allergens: [] as string[],
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      const response = await fetch("/api/recipes?page=1&limit=200", {
        credentials: "include",
      });
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    }
  }

  function handleAddIngredient() {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: "", quantity: 0, unit: "g" }],
    });
  }

  function handleRemoveIngredient(index: number) {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  }

  function handleAddInstruction() {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""],
    });
  }

  function handleRemoveInstruction(index: number) {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editingRecipe ? `/api/recipes/${editingRecipe.id}` : "/api/recipes";
      const method = editingRecipe ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save recipe");
      }

      await fetchRecipes();
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(recipeId: number) {
    if (!confirm("Da li ste sigurni da želite da obrišete ovaj recept?")) return;

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete recipe");

      await fetchRecipes();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Greška pri brisanju recepta");
    }
  }

  function handleEdit(recipe: Recipe) {
    setEditingRecipe(recipe);
    
    // Parse JSON fields
    const ingredients = typeof recipe.ingredients === 'string' 
      ? JSON.parse(recipe.ingredients) 
      : recipe.ingredients || [{ name: "", quantity: 0, unit: "g" }];
    
    const instructions = typeof recipe.instructions === 'string'
      ? JSON.parse(recipe.instructions)
      : recipe.instructions || [""];
    
    const dietaryTags = recipe.dietaryTags 
      ? (typeof recipe.dietaryTags === 'string' ? JSON.parse(recipe.dietaryTags) : recipe.dietaryTags)
      : [];
    
    const allergens = recipe.allergens
      ? (typeof recipe.allergens === 'string' ? JSON.parse(recipe.allergens) : recipe.allergens)
      : [];

    setFormData({
      title: recipe.title,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      category: recipe.category,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty as any,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fats: recipe.fats,
      ingredients,
      instructions,
      dietaryTags,
      allergens,
    });
    
    setIsDialogOpen(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "lunch",
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: "medium",
      calories: 400,
      protein: 25,
      carbs: 45,
      fats: 15,
      ingredients: [{ name: "", quantity: 0, unit: "g" }],
      instructions: [""],
      dietaryTags: [],
      allergens: [],
    });
    setEditingRecipe(null);
  }

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin - Upravljanje Receptima</h1>
          <p className="text-gray-600">Dodaj, izmeni ili obriši recepte</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj Recept
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecipe ? "Izmeni Recept" : "Novi Recept"}
              </DialogTitle>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="title">Naslov *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Slike *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded mt-2" />
                )}
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorija</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Doručak</SelectItem>
                      <SelectItem value="lunch">Ručak</SelectItem>
                      <SelectItem value="dinner">Večera</SelectItem>
                      <SelectItem value="snack">Užina</SelectItem>
                      <SelectItem value="dessert">Desert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Težina</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Lako</SelectItem>
                      <SelectItem value="medium">Srednje</SelectItem>
                      <SelectItem value="hard">Teško</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Times & Servings */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Priprema (min)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookTime">Kuvanje (min)</Label>
                  <Input
                    id="cookTime"
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Porcija</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
              </div>

              {/* Nutrition */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Kalorije</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protein">Proteini (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carbs">Ugljeni hidrati (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fats">Masti (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) || 0 })}
                    min={0}
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Sastojci</Label>
                  <Button type="button" onClick={handleAddIngredient} size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Dodaj
                  </Button>
                </div>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Naziv"
                      value={ingredient.name}
                      onChange={(e) => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index].name = e.target.value;
                        setFormData({ ...formData, ingredients: newIngredients });
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Količina"
                      value={ingredient.quantity}
                      onChange={(e) => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index].quantity = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, ingredients: newIngredients });
                      }}
                      className="w-24"
                    />
                    <Input
                      placeholder="Jedinica"
                      value={ingredient.unit}
                      onChange={(e) => {
                        const newIngredients = [...formData.ingredients];
                        newIngredients[index].unit = e.target.value;
                        setFormData({ ...formData, ingredients: newIngredients });
                      }}
                      className="w-20"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Uputstvo</Label>
                  <Button type="button" onClick={handleAddInstruction} size="sm" variant="outline">
                    <Plus className="w-3 h-3 mr-1" />
                    Dodaj Korak
                  </Button>
                </div>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-sm text-gray-500 mt-2">{index + 1}.</span>
                    <Textarea
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...formData.instructions];
                        newInstructions[index] = e.target.value;
                        setFormData({ ...formData, instructions: newInstructions });
                      }}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveInstruction(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={loading}
                >
                  Otkaži
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Čuvanje..." : editingRecipe ? "Sačuvaj Izmene" : "Kreiraj Recept"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Pretraži recepte..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Badge variant="secondary">{filteredRecipes.length} recepata</Badge>
      </div>

      {/* Recipes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-lg">{recipe.title}</CardTitle>
              <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{recipe.category}</Badge>
                <Badge variant="outline">{recipe.difficulty}</Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {recipe.calories} kcal
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe.prepTime + recipe.cookTime} min
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {recipe.servings}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(recipe)} className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Izmeni
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(recipe.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Obriši
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nema recepata. Dodaj prvi recept!</p>
        </div>
      )}
    </div>
  );
}
