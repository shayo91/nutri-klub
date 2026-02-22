import { useState, useEffect, useCallback } from "react";
import { Bell, Search, ChevronDown, LogOut, User, Settings, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function DashboardHeader() {
  const { user, logout, isPremium } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search with auto-submit
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer = setTimeout(() => {
      setLocation(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, setLocation]);

  // Update search query from URL
  useEffect(() => {
    const updateSearchFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("q") || params.get("search");
      if (search) {
        setSearchQuery(search);
      } else if (window.location.pathname !== "/dashboard/search") {
        setSearchQuery("");
      }
    };

    updateSearchFromURL();

    // Listen for URL changes
    window.addEventListener("popstate", updateSearchFromURL);
    return () => window.removeEventListener("popstate", updateSearchFromURL);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, setLocation]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Pretraži recepte, e-bookove..."
              className="pl-10 pr-12 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onInput={(e: any) => {
                // When user clears input with X button, redirect to clear results
                if (e.target.value === "" && window.location.pathname === "/dashboard/search") {
                  setLocation("/dashboard/search");
                }
              }}
            />
            {searchQuery && (
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Search className="w-4 h-4 text-[#1F7A5C]" />
              </Button>
            )}
          </form>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifikacije</h3>
                  <Badge variant="secondary" className="text-xs">Novo</Badge>
                </div>
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Notifikacije dolaze uskoro! 🔔
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Bićete obavešteni kada budemo dodali ovu funkciju.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>

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
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="flex items-center cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Naplata</span>
                </Link>
              </DropdownMenuItem>
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
