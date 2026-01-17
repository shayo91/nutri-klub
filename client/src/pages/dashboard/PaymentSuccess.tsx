import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Refresh user data to get updated premium status
    refreshUser();
  }, []);

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
