import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Helmet>
        <title>Stranica nije pronađena | Nutricionista Jelena Matijaš</title>
        <meta name="description" content="Stranica koju tražite nije pronađena. Posjetite početnu stranicu nutricioniste Jelene Matijaš." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">Stranica nije pronađena</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Stranica koju tražite ne postoji ili je premještena.
          </p>

          <Link href="/">
            <a className="mt-6 inline-block text-[#5DAD8C] hover:text-[#4A9A79] font-medium transition-colors">
              Vratite se na početnu stranicu
            </a>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
