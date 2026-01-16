import { Bell, Search, ChevronDown, LogOut, User, Settings, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function DashboardHeader() {
  const { user, logout, isPremium } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Pretraži recepte, e-bookove..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Trial/Premium Badge */}
          {!isPremium && (
            <Link href="/dashboard/upgrade">
              <Badge className="bg-[#FFD700] text-gray-900 hover:bg-[#FFD700] cursor-pointer">
                🎁 Probaj Premium - 7 dana besplatno
              </Badge>
            </Link>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1F7A5C] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || "Korisnik"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isPremium ? "Premium" : "Free Trial"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isPremium ? "Premium Member" : "Free Trial"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  <span>Moj Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Postavke</span>
                </Link>
              </DropdownMenuItem>
              {isPremium && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/billing" className="flex items-center cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Naplata</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Odjavi se</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
