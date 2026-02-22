import { Lock, Crown, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FeatureLockProps {
  title: string;
  description: string;
  features?: string[];
  children?: React.ReactNode;
  variant?: "overlay" | "card";
}

export function FeatureLock({
  title,
  description,
  features,
  children,
  variant = "overlay",
}: FeatureLockProps) {
  if (variant === "card") {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1F7A5C] to-[#185A44] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>

          {features && features.length > 0 && (
            <div className="mb-6 space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          <Link href="/dashboard/upgrade">
            <Button className="bg-[#1F7A5C] hover:bg-[#185A44] text-white">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade na Premium
            </Button>
          </Link>
          
          <p className="text-xs text-gray-500 mt-3">
            Probaj besplatno 7 dana • Otkazi bilo kada
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white/95 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1F7A5C] to-[#185A44] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6 text-lg">{description}</p>

          {features && features.length > 0 && (
            <div className="mb-8 space-y-3 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Sa Premium dobijate:
              </p>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <div className="w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-gray-900" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          )}

          <Link href="/dashboard/upgrade">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#1F7A5C] to-[#185A44] hover:opacity-90 text-white shadow-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade na Premium
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">
            🎁 <strong>7 dana besplatno</strong> • Otkazi bilo kada • Od 4€/mesec
          </p>
        </div>
      </div>
    </div>
  );
}
