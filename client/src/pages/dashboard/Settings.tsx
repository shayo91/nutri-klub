import { useState, useEffect } from "react";
import { Link } from "wouter";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, CreditCard, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, isPremium, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Initialize form with user data when user loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  async function handleUpdateProfile() {
    setIsUpdatingProfile(true);
    
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update profile");
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      await refreshUser();
      
      toast({
        title: "Uspešno!",
        description: "Profil je uspešno ažuriran.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Greška",
        description: error.message || "Neuspešno ažuriranje profila.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  }
  
  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Greška",
        description: "Nova lozinka i potvrda se ne poklapaju.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const error = await response.json();
          throw new Error(error.error || "Failed to change password");
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Uspešno!",
        description: "Lozinka je uspešno promenjena.",
      });
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        title: "Greška",
        description: error.message || "Neuspešna promena lozinke.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm("Da li ste sigurni da želite da otkažete pretplatu? Izgubićete pristup Premium funkcionalnostima.")) {
      return;
    }

    try {
      const response = await fetch("/api/payments/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      await refreshUser();

      toast({
        title: "Pretplata otkazana",
        description: "Vaša pretplata je uspešno otkazana.",
      });
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast({
        title: "Greška",
        description: "Neuspešno otkazivanje pretplate.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Postavke</h1>
              <p className="text-gray-600">Upravljaj svojim nalogom i preferencijama.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifikacije
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Pretplata
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Sigurnost
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Osnovne Informacije</CardTitle>
                    <CardDescription>
                      Ažuriraj svoje lične podatke i preferencije.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ime</Label>
                        <Input 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Prezime</Label>
                        <Input 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" defaultValue={user?.email} disabled />
                      <p className="text-xs text-gray-500 mt-1">
                        Email ne može biti promenjen
                      </p>
                    </div>
                    <Button 
                      className="bg-[#1F7A5C] hover:bg-[#185A44]"
                      onClick={handleUpdateProfile}
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? "Čuvanje..." : "Sačuvaj Promene"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifikacije</CardTitle>
                    <CardDescription>
                      Upravljaj kako i kada primaš notifikacije.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Notifikacija postavke će biti dostupne uskoro.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscription Tab */}
              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Tvoja Pretplata
                      {isPremium && (
                        <Badge className="bg-[#FFD700] text-gray-900 hover:bg-[#FFD700]">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {isPremium
                        ? "Upravljaj svojom Premium pretplatom."
                        : "Trenutno koristiš Free Trial."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isPremium ? (
                      <div className="text-center p-8 bg-gradient-to-br from-[#ECF8F2] to-[#E8F5F0] rounded-lg">
                        <Crown className="w-12 h-12 text-[#1F7A5C] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Upgrade na Premium
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Otkljucaj sve funkcionalnosti već od 4€/mesec
                        </p>
                        <Link href="/dashboard/upgrade">
                          <Button className="bg-[#1F7A5C] hover:bg-[#185A44]">
                            Pogledaj Planove
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <p className="text-lg font-semibold text-gray-900">Aktivna</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Sledeća Naplata</p>
                            <p className="text-lg font-semibold text-gray-900">15.02.2026</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="text-red-600"
                          onClick={handleCancelSubscription}
                        >
                          Otkaži Pretplatu
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Sigurnost</CardTitle>
                    <CardDescription>
                      Upravljaj sigurnošću svog naloga.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Promeni Lozinku</h3>
                      <div className="space-y-3">
                        <Input 
                          type="password" 
                          placeholder="Trenutna lozinka" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Input 
                          type="password" 
                          placeholder="Nova lozinka" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Input 
                          type="password" 
                          placeholder="Potvrdi novu lozinku" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button 
                          className="bg-[#1F7A5C] hover:bg-[#185A44]"
                          onClick={handleChangePassword}
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? "Menjanje..." : "Promeni Lozinku"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
