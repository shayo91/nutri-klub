import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

const STEPS = [
  { id: 1, title: "Vaš cilj", description: "Šta želite da postignete?" },
  { id: 2, title: "Osnovne informacije", description: "Pomozite nam da vas bolje upoznamo" },
  { id: 3, title: "Preferencije", description: "Šta volite, a šta ne?" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    goal: "",
    currentWeight: "",
    targetWeight: "",
    height: "",
    age: "",
    gender: "",
    activityLevel: "",
    allergies: [] as string[],
    dietaryRestrictions: [] as string[],
    dislikedFoods: [] as string[],
  });

  function handleNext() {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleSkip() {
    setLocation("/dashboard");
  }

  function toggleArrayItem(field: keyof typeof formData, value: string) {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentArray.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentArray, value],
      });
    }
  }

  async function handleSubmit() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          goal: formData.goal || undefined,
          currentWeight: formData.currentWeight || undefined,
          targetWeight: formData.targetWeight || undefined,
          height: formData.height || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          activityLevel: formData.activityLevel || undefined,
          allergies: formData.allergies,
          dietaryRestrictions: formData.dietaryRestrictions,
          dislikedFoods: formData.dislikedFoods,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save preferences");
      }

      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4] p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
              </div>
              <Button variant="ghost" onClick={handleSkip}>
                Preskoči
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>Šta je vaš glavni cilj?</Label>
              <RadioGroup value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="lose_weight" id="lose_weight" />
                  <Label htmlFor="lose_weight" className="cursor-pointer flex-1">
                    Mršavljenje
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="gain_muscle" id="gain_muscle" />
                  <Label htmlFor="gain_muscle" className="cursor-pointer flex-1">
                    Povećanje mišićne mase
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="maintain" id="maintain" />
                  <Label htmlFor="maintain" className="cursor-pointer flex-1">
                    Održavanje trenutne težine
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="health" id="health" />
                  <Label htmlFor="health" className="cursor-pointer flex-1">
                    Opšte zdravlje i dobrobit
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Trenutna težina (kg)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder="70"
                    value={formData.currentWeight}
                    onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Ciljna težina (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    placeholder="65"
                    value={formData.targetWeight}
                    onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Visina (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Godina</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pol</Label>
                <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Muško</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Žensko</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">Drugo</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Nivo aktivnosti</Label>
                <RadioGroup
                  value={formData.activityLevel}
                  onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                >
                  <div className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <RadioGroupItem value="sedentary" id="sedentary" />
                    <Label htmlFor="sedentary" className="cursor-pointer flex-1">Sedentarno (malo ili nimalo vežbanja)</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="cursor-pointer flex-1">Lako aktivno (1-3 dana nedeljno)</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="cursor-pointer flex-1">Umereno aktivno (3-5 dana)</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="cursor-pointer flex-1">Vrlo aktivno (6-7 dana)</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <RadioGroupItem value="very_active" id="very_active" />
                    <Label htmlFor="very_active" className="cursor-pointer flex-1">Ekstremno aktivno (2x dnevno)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Alergije (opcionalno)</Label>
                <div className="flex flex-wrap gap-2">
                  {["Laktoza", "Gluten", "Orasi", "Soja", "Jaja", "Riba", "Školjke"].map((item) => (
                    <Badge
                      key={item}
                      variant={formData.allergies.includes(item) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem("allergies", item)}
                    >
                      {item}
                      {formData.allergies.includes(item) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dijetetske preferencije (opcionalno)</Label>
                <div className="flex flex-wrap gap-2">
                  {["Vegetarijanska", "Veganska", "Keto", "Paleo", "Bezglutenska", "Halal", "Kosher"].map((item) => (
                    <Badge
                      key={item}
                      variant={formData.dietaryRestrictions.includes(item) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem("dietaryRestrictions", item)}
                    >
                      {item}
                      {formData.dietaryRestrictions.includes(item) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Namirnice koje ne volite (opcionalno)</Label>
                <div className="flex flex-wrap gap-2">
                  {["Pasulj", "Povrće", "Riba", "Sir", "Pečurke", "Avokado", "Masline"].map((item) => (
                    <Badge
                      key={item}
                      variant={formData.dislikedFoods.includes(item) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem("dislikedFoods", item)}
                    >
                      {item}
                      {formData.dislikedFoods.includes(item) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              Nazad
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-[#8B4513] hover:bg-[#6D3710]"
            >
              {isLoading ? "Čuvanje..." : currentStep === STEPS.length ? "Završi" : "Dalje"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
