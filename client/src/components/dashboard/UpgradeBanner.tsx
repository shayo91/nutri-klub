import { Crown, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UpgradeBannerProps {
  variant?: "compact" | "full";
  dismissible?: boolean;
}

export function UpgradeBanner({ variant = "full", dismissible = false }: UpgradeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-[#1F7A5C] to-[#185A44] rounded-lg p-4 relative">
        {dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-[#FFD700]" />
            <div>
              <p className="text-white font-semibold text-sm">
                Upgrade na Premium
              </p>
              <p className="text-white/80 text-xs">
                Neograničeni pristup svim feature-ima
              </p>
            </div>
          </div>
          <Link href="/dashboard/upgrade">
            <Button
              size="sm"
              className="bg-white text-[#1F7A5C] hover:bg-gray-100 whitespace-nowrap"
            >
              Probaj besplatno
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#1F7A5C] via-[#1F7A5C] to-[#185A44] border-0 overflow-hidden relative">
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="p-8 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-[#FFD700]" />
            <h3 className="text-2xl font-bold text-white">
              Otkljucaj Premium Funkcionalnosti
            </h3>
          </div>
          
          <p className="text-white/90 text-lg mb-6 max-w-2xl">
            Dobij neograničen pristup receptima, AI asistentu, tracking napretka, 
            zajednici i još mnogo toga. Počni sa besplatnim 7-dnevnim trial-om!
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-[#FFD700] font-bold text-2xl mb-1">500+</div>
              <div className="text-white/90 text-sm">Zdravih recepata</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-[#FFD700] font-bold text-2xl mb-1">15+</div>
              <div className="text-white/90 text-sm">Premium e-bookova</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-[#FFD700] font-bold text-2xl mb-1">∞</div>
              <div className="text-white/90 text-sm">AI konverzacija</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/upgrade">
              <Button
                size="lg"
                className="bg-[#FFD700] text-gray-900 hover:bg-[#FFD700]/90 font-semibold"
              >
                🎁 Probaj 7 dana besplatno
              </Button>
            </Link>
            <Link href="/dashboard/upgrade">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Pogledaj cenovnik
              </Button>
            </Link>
          </div>

          <p className="text-white/70 text-xs mt-4">
            Nakon trial perioda: 4€/mesec ili 35€/godišnje (uštediš 48€!)
          </p>
        </div>
      </div>
    </Card>
  );
}
