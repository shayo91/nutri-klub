import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const [, setLocation] = useLocation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password.length < 8) {
      setError("Lozinka mora imati najmanje 8 karaktera");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne poklapaju");
      return;
    }

    if (!agreedToTerms) {
      setError("Morate prihvatiti uslove korišćenja");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName || undefined,
        formData.lastName || undefined
      );
      setLocation("/onboarding");
    } catch (err: any) {
      setError(err.message || "Registracija nije uspela. Pokušajte ponovo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link to="/">
              <img src="/logo.svg" alt="Nutri Klub" className="h-12" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Kreirajte nalog</CardTitle>
          <CardDescription className="text-center">
            Započnite vaše putovanje ka zdravijem životu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ime</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Ana"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Prezime</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Marković"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vas.email@primer.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 karaktera"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potvrdite lozinku</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Ponovite lozinku"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Slažem se sa{" "}
                <Link to="/terms" className="text-[#8B4513] hover:underline">
                  uslovima korišćenja
                </Link>{" "}
                i{" "}
                <Link to="/privacy" className="text-[#8B4513] hover:underline">
                  politikom privatnosti
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B4513] hover:bg-[#6D3710]"
              disabled={isLoading}
            >
              {isLoading ? "Registracija..." : "Registrujte se"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Već imate nalog?{" "}
            <Link to="/login" className="text-[#8B4513] hover:underline font-semibold">
              Prijavite se
            </Link>
          </div>
          <div className="text-sm text-center">
            <Link to="/" className="text-muted-foreground hover:text-[#8B4513]">
              ← Nazad na početnu
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
