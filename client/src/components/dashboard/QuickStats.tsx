import { BookOpen, Heart, TrendingUp, Flame, Crown, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  link?: string;
  isPremium?: boolean;
}

interface QuickStatsProps {
  stats?: Stat[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  const { isPremium } = useAuth();

  // Default stats if none provided
  const defaultStats: Stat[] = [
    {
      label: "Sačuvani recepti",
      value: isPremium ? 12 : 0,
      icon: <Heart className="w-5 h-5" />,
      color: "text-red-500",
      link: "/dashboard/recipes?filter=favorites",
      isPremium: true,
    },
    {
      label: "Pregledan recepti",
      value: isPremium ? 45 : 2,
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-blue-500",
      link: "/dashboard/recipes",
    },
    {
      label: "Dani streak-a",
      value: isPremium ? 7 : 1,
      icon: <Flame className="w-5 h-5" />,
      color: "text-orange-500",
      isPremium: true,
    },
    {
      label: "Napredak",
      value: isPremium ? "85%" : "-",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-500",
      link: "/dashboard/progress",
      isPremium: true,
    },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => {
        const isLocked = stat.isPremium && !isPremium;
        const StatCard = (
          <Card
            key={index}
            className={`p-6 transition-all duration-200 ${
              isLocked
                ? "bg-gray-50 border-dashed border-gray-300 opacity-75"
                : "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isLocked
                    ? "bg-gray-200"
                    : `bg-${stat.color.split("-")[1]}-100`
                }`}
              >
                <div className={isLocked ? "text-gray-400" : stat.color}>
                  {stat.icon}
                </div>
              </div>
              {isLocked && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
            <div className={isLocked ? "filter blur-sm" : ""}>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            {isLocked && (
              <div className="mt-3">
                <Link href="/dashboard/upgrade">
                  <span className="text-xs text-[#1F7A5C] font-medium hover:underline">
                    Upgrade za pristup →
                  </span>
                </Link>
              </div>
            )}
          </Card>
        );

        if (stat.link && !isLocked) {
          return (
            <Link key={index} href={stat.link}>
              {StatCard}
            </Link>
          );
        }

        return StatCard;
      })}
    </div>
  );
}

interface MembershipStatsProps {
  subscriptionType?: "free" | "premium" | "yearly";
  daysLeft?: number;
  nextBillingDate?: string;
}

export function MembershipStats({
  subscriptionType = "free",
  daysLeft = 7,
  nextBillingDate,
}: MembershipStatsProps) {
  const getStatusColor = () => {
    if (subscriptionType === "free") return "from-gray-500 to-gray-600";
    return "from-[#1F7A5C] to-[#185A44]";
  };

  const getStatusIcon = () => {
    if (subscriptionType === "free") {
      return <Calendar className="w-6 h-6" />;
    }
    return <Crown className="w-6 h-6" />;
  };

  const getStatusTitle = () => {
    if (subscriptionType === "free") return "Free Trial";
    if (subscriptionType === "yearly") return "Premium Godišnja";
    return "Premium Mjesečna";
  };

  const getStatusDescription = () => {
    if (subscriptionType === "free") {
      return `${daysLeft} dana preostalo`;
    }
    if (nextBillingDate) {
      return `Naredna naplata: ${nextBillingDate}`;
    }
    return "Aktivna pretplata";
  };

  return (
    <Card className={`bg-gradient-to-br ${getStatusColor()} border-0 text-white p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          {getStatusIcon()}
        </div>
        {subscriptionType === "free" && (
          <Link href="/dashboard/upgrade">
            <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
              Upgrade
            </button>
          </Link>
        )}
      </div>
      <h3 className="text-xl font-bold mb-1">{getStatusTitle()}</h3>
      <p className="text-white/80 text-sm">{getStatusDescription()}</p>
    </Card>
  );
}
