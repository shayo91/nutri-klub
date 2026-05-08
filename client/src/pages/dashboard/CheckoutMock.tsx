import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardNav } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Check } from "lucide-react";

const PRICING_INFO: Record<string, any> = {
  premium_monthly: { name: "Premium Mesečno", amount: "4€", period: "/mesec" },
  premium_yearly: { name: "Premium Godišnje", amount: "35€", period: "/godinu", save: "Ušteda 13€!" },
  plan_start: { name: "Start Plan", amount: "46€", period: "jednokratno", consultations: "1 konsultacija" },
  plan_balans: { name: "Balans Plan", amount: "97€", period: "jednokratno", consultations: "3 konsultacije" },
  plan_transformacija: { name: "Transformacija Plan", amount: "199€", period: "jednokratno", consultations: "6 konsultacija" },
};

export default function CheckoutMock() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("orderId"));
    setOrderType(params.get("orderType"));
  }, []);

  const pricing = orderType ? PRICING_INFO[orderType] : null;

  async function handlePayment() {
    if (!orderId) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/payments/complete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const data = await response.json();

      toast({
        title: "Uspešno! 🎉",
        description: "Uplata je uspešno procesirana!",
      });

      // Redirect after 1 second
      setTimeout(() => {
        setLocation(data.redirectUrl);
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške pri procesiranju uplate.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }

  if (!pricing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Mock Checkout</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            Ovo je mock payment stranica za testiranje.
            <br />U production-u, ovo bi bio Stripe Checkout.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{pricing.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1F7A5C]">{pricing.amount}</span>
              <span className="text-gray-600">{pricing.period}</span>
            </div>
            {pricing.save && (
              <div className="text-sm text-green-600 font-medium">{pricing.save}</div>
            )}
            {pricing.consultations && (
              <div className="text-sm text-gray-600">{pricing.consultations}</div>
            )}
          </div>

          {/* Mock Card Input */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Card Number</label>
              <div className="mt-1 p-3 border rounded-lg bg-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">4242 4242 4242 4242</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Expiry</label>
                <div className="mt-1 p-3 border rounded-lg bg-white">
                  <span className="text-gray-400">12/25</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">CVC</label>
                <div className="mt-1 p-3 border rounded-lg bg-white">
                  <span className="text-gray-400">123</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Included */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Uključeno:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Neograničeni recepti
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                15+ premium e-bookova
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Neograničen AI chat
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Progress tracking
              </li>
              {orderType?.startsWith("plan_") && (
                <>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Personalizovani plan ishrane
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    1-on-1 konsultacije
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#1F7A5C] hover:bg-[#185A44] h-12 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Procesiranje...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Plati {pricing.amount}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Secured by Stripe (Mock) • Test Mode
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
