import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { refreshUser } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      // Mock mode or direct access
      refreshUser();
      setVerifying(false);
      return;
    }

    // Give webhook time to process (1-2 seconds)
    setTimeout(async () => {
      try {
        // Refresh user data to get updated premium status
        await refreshUser();
        setVerifying(false);
      } catch (err) {
        setError("Došlo je do greške pri verifikaciji plaćanja.");
        setVerifying(false);
      }
    }, 2000);
  }, [refreshUser]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifikujemo Vaše Plaćanje
              </h2>
              <p className="text-gray-600">
                Molimo sačekajte trenutak...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="text-4xl">⚠️</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Greška
              </h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <Button
              onClick={() => setLocation("/dashboard")}
              className="w-full"
            >
              Nazad na Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dobrodošao u Premium! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Tvoja uplata je uspešno procesirana.
            </p>
          </div>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-r from-[#1F7A5C] to-[#2A9D8F] text-white p-6 rounded-lg space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Otkljucano:</h3>
            </div>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Neograničeni recepti i e-bookovi
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Neograničen AI nutritionist asistent
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Napredni progress tracking i chart-ovi
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Pristup zajednici i challenges
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => setLocation("/dashboard")}
              className="w-full bg-[#1F7A5C] hover:bg-[#185A44] h-12 text-lg"
            >
              Idi na Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => setLocation("/dashboard/recipes")}
              variant="outline"
              className="w-full h-12"
            >
              Istraži Recepte
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Možeš otkazati pretplatu bilo kada u postavkama.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
