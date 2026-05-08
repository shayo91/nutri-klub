import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, dashboardEnabled, configLoaded } = useAuth();
  const [, setLocation] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!configLoaded || !dashboardEnabled) {
        setError(
          "Korisnički panel trenutno nije aktivan. Kontaktirajte podršku ili pokušajte kasnije."
        );
        return;
      }

      const loggedIn = await login(email, password);

      if (!loggedIn.onboardingCompleted) {
        setLocation("/onboarding");
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
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
          <CardTitle className="text-2xl font-bold text-center">Dobrodošli nazad</CardTitle>
          <CardDescription className="text-center">
            Prijavite se na svoj nalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {configLoaded && !dashboardEnabled && (
              <Alert>
                <AlertDescription>
                  Panel za korisnike je privremeno isključen (ENABLE_DASHBOARD).
                  Javni sadržaj sajta i dalje radi.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vas.email@primer.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !configLoaded || !dashboardEnabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Lozinka</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#8B4513] hover:underline"
                >
                  Zaboravili ste lozinku?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !configLoaded || !dashboardEnabled}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B4513] hover:bg-[#6D3710]"
              disabled={isLoading || !configLoaded || !dashboardEnabled}
            >
              {isLoading ? "Prijavljivanje..." : "Prijavite se"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Nemate nalog?{" "}
            <Link to="/register" className="text-[#8B4513] hover:underline font-semibold">
              Registrujte se
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
