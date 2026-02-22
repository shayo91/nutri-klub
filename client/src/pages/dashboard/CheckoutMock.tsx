import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Check } from "lucide-react";

const CONTACT_EMAIL = "planishrane@nutricionistajelena.ba";

const PRICING_INFO: Record<string, { name: string; amount: string; period: string; save?: string; consultations?: string }> = {
  plan_konsultacije: {
    name: "Konsultacije",
    amount: "80",
    period: "KM (jednokratno)",
    consultations: "Online konsultacije, pisane smjernice, podrška 30 dana",
  },
  plan_mjesecni: {
    name: "Mjesečni mentorski program",
    amount: "200",
    period: "KM (jednokratno)",
    consultations: "Uvodne konsultacije, 2 sedmična jelovnika, podrška 30 dana",
  },
  plan_visemjesecni: {
    name: "Višemjesečni mentorski program",
    amount: "400",
    period: "KM (jednokratno)",
    consultations: "3 mjeseca saradnje, 6 jelovnika, podrška 90 dana",
  },
  premium_monthly: {
    name: "Premium mjesečno",
    amount: "15",
    period: "KM / mjesec",
  },
  premium_yearly: {
    name: "Premium godišnje",
    amount: "150",
    period: "KM / godinu",
    save: "Ušteda u odnosu na mjesečno",
  },
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

  async function handleMarkAsPaid() {
    if (!orderId) return;
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payments/complete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error("Payment failed");
      const data = await response.json();
      toast({ title: "Uspešno!", description: "Narudžba označena kao plaćena (test)." });
      setTimeout(() => setLocation(data.redirectUrl || "/dashboard"), 1000);
    } catch (error) {
      console.error("Payment error:", error);
      toast({ title: "Greška", description: "Došlo je do greške.", variant: "destructive" });
      setIsProcessing(false);
    }
  }

  if (!pricing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-gray-600">Učitavanje...</div>
      </div>
    );
  }

  const mailSubject = encodeURIComponent(`Uplata – ${pricing.name} – Nutri Klub`);
  const mailBody = encodeURIComponent(
    "Poštovani,\n\nZatražio/la sam podatke za uplatu za: " +
      pricing.name +
      " (" +
      pricing.amount +
      " " +
      (pricing.period.includes("KM") ? "KM" : "") +
      ").\n\nMolim podatke za uplatu (žiro-račun, svrha plaćanja, iznos).\n\nNakon uplate poslaću vam dokaz o uplati na ovaj email.\n\nHvala!"
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Uputstvo za uplatu</CardTitle>
          <p className="text-sm text-gray-600 text-center">
            U Bosni i Hercegovini plaćanje se vrši <strong>mobilnim bankarstvom</strong> ili{" "}
            <strong>uplatnicom</strong>. Podatke za uplatu dobijate putem emaila. Nakon što uplatite, pošaljete dokaz na{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1F7A5C] underline">{CONTACT_EMAIL}</a>, a pristupne podatke dobijate također putem emaila. <strong>Free</strong> nivo je dostupan svakome bez plaćanja.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{pricing.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#1F7A5C]">{pricing.amount} KM</span>
              <span className="text-gray-600 text-sm">{pricing.period}</span>
            </div>
            {pricing.save && <div className="text-sm text-green-600 font-medium">{pricing.save}</div>}
            {pricing.consultations && <div className="text-sm text-gray-600">{pricing.consultations}</div>}
          </div>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Neograničeni recepti (premium)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Premium e-bookovi</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> AI asistent</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Praćenje napretka</li>
          </ul>

          <Button
            className="w-full bg-[#1F7A5C] hover:bg-[#185A44] h-12 text-lg"
            asChild
          >
            <a href={`mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`}>
              <Mail className="w-5 h-5 mr-2" />
              Kontaktiraj za uplatu
            </a>
          </Button>

          <p className="text-xs text-center text-gray-500">
            Uplata u BiH – mobilno bankarstvo ili uplatnica. Aktivacija po dokazu uplate.
          </p>

          {orderId && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleMarkAsPaid}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Test: označi kao plaćeno
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
