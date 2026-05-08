import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { dashboardEnabled, configLoaded } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!configLoaded || !dashboardEnabled) {
        setError("Reset lozinke trenutno nije dostupan jer je panel isključen.");
        return;
      }

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
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
          <CardTitle className="text-2xl font-bold text-center">
            Zaboravili ste lozinku?
          </CardTitle>
          <CardDescription className="text-center">
            Unesite email adresu i poslaćemo vam link za resetovanje
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Email poslat!</h3>
                <p className="text-sm text-muted-foreground">
                  Proverite svoju email inbox za link za resetovanje lozinke.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {configLoaded && !dashboardEnabled && (
                <Alert>
                  <AlertDescription>
                    Panel je privremeno isključen (ENABLE_DASHBOARD).
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

              <Button
                type="submit"
                className="w-full bg-[#8B4513] hover:bg-[#6D3710]"
                disabled={isLoading || !configLoaded || !dashboardEnabled}
              >
                {isLoading ? "Slanje..." : "Pošalji link za resetovanje"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            <Link to="/login" className="text-[#8B4513] hover:underline">
              ← Nazad na prijavu
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
