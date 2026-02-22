import { TrendingUp, AlertCircle, Check } from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UsageLimit {
  feature: string;
  used: number;
  limit: number;
  icon?: React.ReactNode;
  description?: string;
}

interface UsageMeterProps {
  limits: UsageLimit[];
  daysLeft?: number;
  variant?: "card" | "compact";
}

export function UsageMeter({ limits, daysLeft = 7, variant = "card" }: UsageMeterProps) {
  const getUsageColor = (percentage: number) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-[#1F7A5C]";
  };

  if (variant === "compact") {
    const totalUsed = limits.reduce((acc, limit) => acc + limit.used, 0);
    const totalLimit = limits.reduce((acc, limit) => acc + limit.limit, 0);
    const percentage = Math.round((totalUsed / totalLimit) * 100);

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">
              Free Trial Usage
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {daysLeft} dana preostalo
          </Badge>
        </div>
        <Progress value={percentage} className="h-2 mb-2" />
        <p className="text-xs text-gray-600">
          Iskorišćeno {totalUsed} od {totalLimit} dostupnih feature-a
        </p>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Trial Ograničenja
          </h3>
          <p className="text-sm text-gray-600">
            Preostalo <strong>{daysLeft} dana</strong> besplatnog trial-a
          </p>
        </div>
        <div className="text-right">
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            Free Trial
          </Badge>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {limits.map((limit, index) => {
          const percentage = Math.round((limit.used / limit.limit) * 100);
          const isExhausted = percentage >= 100;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {limit.icon}
                  <span className="text-sm font-medium text-gray-900">
                    {limit.feature}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${getUsageColor(percentage)}`}>
                  {limit.used} / {limit.limit}
                </span>
              </div>
              
              <Progress
                value={percentage}
                className="h-2 mb-1"
                indicatorClassName={getProgressColor(percentage)}
              />
              
              {limit.description && (
                <p className="text-xs text-gray-500">{limit.description}</p>
              )}
              
              {isExhausted && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Limit dostignut - Upgrade za više!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Premium Benefits */}
      <div className="bg-gradient-to-br from-[#ECF8F2] to-[#E8F5F0] rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#1F7A5C]" />
          Sa Premium dobijate:
        </p>
        <div className="space-y-2">
          {[
            "Neograničeni recepti i AI poruke",
            "Pristup svim e-bookovima",
            "Tracking napretka i zajednica",
            "Prioritetna podrška",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-[#1F7A5C]" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <Link href="/dashboard/upgrade">
        <Button className="w-full bg-[#1F7A5C] hover:bg-[#185A44]">
          Upgrade na Premium
        </Button>
      </Link>
      
      <p className="text-center text-xs text-gray-500 mt-3">
        🎁 Probaj 7 dana besplatno • Od 4€/mesec
      </p>
    </Card>
  );
}
