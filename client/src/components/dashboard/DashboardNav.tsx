import { Link, useLocation } from "wouter";
import {
  Home,
  BookOpen,
  BookMarked,
  UtensilsCrossed,
  Bot,
  Users,
  TrendingUp,
  Target,
  Settings,
  CreditCard,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  requirePremium?: boolean;
  requirePlan?: boolean;
  badge?: string;
}

export function DashboardNav() {
  const [location] = useLocation();
  const { user, isPremium } = useAuth();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Recepti",
      href: "/dashboard/recipes",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "E-bookovi",
      href: "/dashboard/ebooks",
      icon: <BookMarked className="w-5 h-5" />,
    },
    {
      label: "Recept Dana",
      href: "/dashboard/recipe-of-the-day",
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      label: "AI Asistent",
      href: "/dashboard/ai-assistant",
      icon: <Bot className="w-5 h-5" />,
      badge: "NEW",
    },
    {
      label: "Zajednica",
      href: "/dashboard/community",
      icon: <Users className="w-5 h-5" />,
      requirePremium: true,
    },
    {
      label: "Napredak",
      href: "/dashboard/progress",
      icon: <TrendingUp className="w-5 h-5" />,
      requirePremium: true,
    },
    {
      label: "Moj Plan",
      href: "/dashboard/my-plan",
      icon: <Target className="w-5 h-5" />,
      requirePlan: true,
    },
    {
      label: "Postavke",
      href: "/dashboard/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const hasPlan = user?.subscriptionStatus === "active" && user?.role !== "free";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#1F7A5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-gray-900">NutriHub</span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1F7A5C] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName || "Korisnik"}
            </p>
            <div className="flex items-center gap-1">
              {isPremium ? (
                <Badge className="bg-[#FFD700] text-gray-900 hover:bg-[#FFD700]">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Free Trial
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const isLocked =
            (item.requirePremium && !isPremium) || (item.requirePlan && !hasPlan);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer relative",
                  isActive
                    ? "bg-[#ECF8F2] text-[#1F7A5C] font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                  isLocked && "opacity-60"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
                {isLocked && (
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA (only for free users) */}
      {!isPremium && (
        <div className="p-4 border-t border-gray-200">
          <Link href="/dashboard/upgrade">
            <div className="bg-gradient-to-br from-[#1F7A5C] to-[#185A44] rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Upgrade na Premium</span>
              </div>
              <p className="text-xs text-white/90 mb-3">
                Neograničeni recepti, AI asistent, tracking i više!
              </p>
              <button className="w-full bg-white text-[#1F7A5C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                Probaj 7 dana besplatno
              </button>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
