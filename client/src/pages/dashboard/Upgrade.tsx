import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Mail, CreditCard } from "lucide-react";

const CardIcon = CreditCard;

const CONTACT_EMAIL = "planishrane@nutricionistajelena.ba";
const CONTACT_SUBJECT = "Plaćanje paketa – Nutri Klub";

const PLANS = [
  {
    id: "plan_konsultacije",
    name: "Konsultacije",
    subtitle: "Za one koji žele početne smjernice",
    price: "80",
    currency: "KM",
    features: [
      "Online konsultacije (60 minuta)",
      "Analiza dnevnika ishrane",
      "Pisane smjernice za poboljšanje ishrane",
      "Podrška putem poruka tokom 30 dana",
    ],
    featured: false,
  },
  {
    id: "plan_mjesecni",
    name: "Mjesečni mentorski program",
    subtitle: "Za one koji žele promjenu i jasnu strukturu",
    price: "200",
    currency: "KM",
    features: [
      "Online uvodne konsultacije",
      "Analiza dnevnika ishrane",
      "Dva individualna sedmična jelovnika",
      "Podrška putem poruka tokom 30 dana",
      "Kontrolni poziv nakon mjesec dana",
    ],
    featured: true,
  },
  {
    id: "plan_visemjesecni",
    name: "Višemjesečni mentorski program",
    subtitle: "Za one koji žele dugoročnu podršku",
    price: "400",
    currency: "KM",
    features: [
      "3 mjeseca saradnje",
      "Šest individualnih sedmičnih jelovnika",
      "Podrška putem poruka tokom 90 dana",
      "Kontrolni poziv (x3)",
    ],
    featured: false,
  },
];

function ContactButton({ planName }: { planName: string }) {
  const subject = encodeURIComponent(`${CONTACT_SUBJECT} – ${planName}`);
  const body = encodeURIComponent(
    "Poštovani,\n\nŽelim da zatražim podatke za uplatu za paket: " +
      planName +
      ".\n\nNakon uplate mobilnim bankarstvom ili uplatnicom poslaću vam dokaz o uplati na ovaj email.\n\nHvala!"
  );
  return (
    <Button
      size="lg"
      className="w-full bg-[#1F7A5C] hover:bg-[#185A44]"
      asChild
    >
      <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`}>
        <Mail className="w-4 h-4 mr-2" />
        Kontaktiraj za uplatu
      </a>
    </Button>
  );
}

export default function Upgrade() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-10 h-10 text-[#FFD700]" />
                <h1 className="text-4xl font-bold text-gray-900">
                  Paketi i cijene
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-4">
                Plaćanje u Bosni i Hercegovini – mobilno bankarstvo ili uplatnica
              </p>
              <Badge className="bg-[#1F7A5C] text-white hover:bg-[#185A44] text-base px-4 py-2">
                Free nivo dostupan svakome – registruj se bez plaćanja
              </Badge>
            </div>

            {/* Kako platiti */}
            <Card className="bg-gradient-to-br from-[#ECF8F2] to-[#E8F5F0] border-[#1F7A5C]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Kako platiti u BiH
                </CardTitle>
                <CardDescription>
                  Podatke za uplatu dobijate putem emaila. Nakon uplate šaljete dokaz, a pristupni podatke dobijate također putem emaila.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p className="flex gap-2">
                  <span className="font-semibold min-w-[1.5rem]">1.</span>
                  Kontaktirajte nas (mail ili poruka) – navedite koji paket želite.
                </p>
                <p className="flex gap-2">
                  <span className="font-semibold min-w-[1.5rem]">2.</span>
                  Dobijate podatke za uplatu (žiro-račun, svrha, iznos).
                </p>
                <p className="flex gap-2">
                  <span className="font-semibold min-w-[1.5rem]">3.</span>
                  Platite mobilnim bankarstvom ili uplatnicom.
                </p>
                <p className="flex gap-2">
                  <span className="font-semibold min-w-[1.5rem]">4.</span>
                  Pošaljite dokaz o uplati na{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1F7A5C] underline">
                    {CONTACT_EMAIL}
                  </a>
                  . Pristupni podaci stižu vam putem emaila.
                </p>
              </CardContent>
            </Card>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden flex flex-col ${
                    plan.featured ? "border-[#1F7A5C] border-2 shadow-xl md:scale-105" : ""
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute top-0 right-0 bg-[#1F7A5C] text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      Najpopularnije
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <CardIcon className="w-5 h-5 text-[#1F7A5C]" />
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#1F7A5C]">{plan.price}</span>
                      <span className="text-gray-600">{plan.currency}</span>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <ContactButton planName={plan.name} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center text-gray-600">
              <p>
                Niste sigurni koji paket odgovara? Pišite nam na{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1F7A5C] font-medium underline">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
