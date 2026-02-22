import { useState, useEffect } from "react";
import { Link } from "wouter";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Crown, Mail, Calendar, FileText } from "lucide-react";

const CONTACT_EMAIL = "planishrane@nutricionistajelena.ba";

interface Order {
  id: number;
  orderType: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

export default function Billing() {
  const { user, isPremium } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments/orders", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const planLabel =
    user?.role === "admin"
      ? "Admin"
      : isPremium
        ? "Premium"
        : "Besplatni nivo";
  const expiresAt = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleDateString("bs-BA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Naplata</h1>
              <p className="text-gray-600 mt-1">
                Trenutni paket i način plaćanja u BiH
              </p>
            </div>

            {/* Trenutni plan */}
            <Card className="border-[#1F7A5C]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPremium || user?.role === "admin" ? (
                      <Crown className="w-8 h-8 text-[#FFD700]" />
                    ) : (
                      <CreditCard className="w-8 h-8 text-[#1F7A5C]" />
                    )}
                    <div>
                      <CardTitle>Trenutni plan</CardTitle>
                      <CardDescription>
                        {planLabel}
                        {expiresAt && ` · Važi do ${expiresAt}`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    className={
                      isPremium || user?.role === "admin"
                        ? "bg-[#1F7A5C] text-white"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {user?.subscriptionStatus === "active"
                      ? "Aktivan"
                      : "Besplatno"}
                  </Badge>
                </div>
              </CardHeader>
              {!isPremium && user?.role !== "admin" && (
                <CardContent className="pt-0">
                  <Link href="/dashboard/upgrade">
                    <Button className="w-full sm:w-auto bg-[#1F7A5C] hover:bg-[#185A44]">
                      <Crown className="w-4 h-4 mr-2" />
                      Nadogradi na Premium
                    </Button>
                  </Link>
                </CardContent>
              )}
            </Card>

            {/* Plaćanje u BiH */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Plaćanje u Bosni i Hercegovini
                </CardTitle>
                <CardDescription>
                  Plaćanje mobilnim bankarstvom ili uplatnicom. Podatke za uplatu
                  dobijate putem emaila.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p className="flex gap-2">
                  <span className="font-semibold min-w-[1.5rem]">1.</span>
                  Kontaktirajte nas (email) i navedite koji paket želite.
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
                  Pošaljite dokaz o uplati na email; pristupni podaci stižu
                  putem emaila.
                </p>
                <Button variant="outline" asChild>
                  <a href={`mailto:${CONTACT_EMAIL}?subject=Plaćanje paketa`}>
                    <Mail className="w-4 h-4 mr-2" />
                    {CONTACT_EMAIL}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Istorija narudžbi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Istorija narudžbi
                </CardTitle>
                <CardDescription>
                  Pregled vaših uplata i narudžbi paketa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500">Učitavanje...</p>
                ) : orders.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nemate zabilježenih narudžbi. Nakon uplate i slanja dokaza
                    na {CONTACT_EMAIL}, narudžba će biti evidentirana.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {orders.map((order) => (
                      <li
                        key={order.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.orderType.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "bs-BA"
                            )}{" "}
                            · {order.amount} {order.currency}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {order.status === "completed"
                            ? "Plaćeno"
                            : order.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
