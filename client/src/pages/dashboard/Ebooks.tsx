import { useState, useEffect } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FeatureLock } from "@/components/dashboard/FeatureLock";
import { EbookCard } from "@/components/ebooks/EbookCard";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ebook {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  pages: number;
  coverImageUrl: string;
  pdfUrl: string;
  fileSize: number;
  isPremium: boolean;
  isFeatured: boolean;
  downloadCount: number;
}

interface UsageStats {
  isPremium: boolean;
  unlimited: boolean;
  downloadsUsed: number;
  downloadsLimit: number | null;
  remainingDownloads: number | null;
}

export default function Ebooks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const isPremium = user?.role === "premium" || user?.role === "admin";

  useEffect(() => {
    fetchEbooks();
    fetchCategories();
    fetchUsageStats();
  }, [selectedCategory]);

  async function fetchEbooks() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/ebooks?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch e-books");
      }

      const data = await response.json();
      setEbooks(data.ebooks);
    } catch (error) {
      console.error("Error fetching e-books:", error);
      toast({
        title: "Greška",
        description: "Nije moguće učitati e-bookove.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/ebooks/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchUsageStats() {
    try {
      const response = await fetch("/api/ebooks/user/usage", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsageStats(data);
      }
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  }

  async function handleDownload(ebookId: number) {
    setDownloadingId(ebookId);

    try {
      const response = await fetch(`/api/ebooks/${ebookId}/download`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to download e-book");
      }

      const data = await response.json();

      // Open PDF in new tab
      window.open(data.downloadUrl, "_blank");

      toast({
        title: "Uspešno preuzeto!",
        description: `E-book "${data.ebook.title}" je preuzet.`,
      });

      // Refresh usage stats
      await fetchUsageStats();
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        title: "Greška",
        description: error.message || "Nije moguće preuzeti e-book.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  }

  const freeEbooks = ebooks.filter((e) => !e.isPremium);
  const premiumEbooks = ebooks.filter((e) => e.isPremium);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">E-bookovi</h1>
                <p className="text-gray-600">
                  {isPremium
                    ? `Preuzmi pristup našoj kolekciji od ${ebooks.length} e-bookova.`
                    : "Preuzmi 1 besplatan e-book. Upgrade za pristup svim e-bookovima!"}
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sve kategorije" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve kategorije</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status Badge */}
            {isPremium ? (
              <Badge className="bg-[#1F7A5C] hover:bg-[#185A44]">
                Premium - Neograničen pristup
              </Badge>
            ) : usageStats && usageStats.remainingDownloads !== null ? (
              <Badge className={usageStats.remainingDownloads === 0 ? "bg-red-500" : "bg-orange-500"}>
                Free Trial - Preostalo: {usageStats.remainingDownloads}/1
              </Badge>
            ) : null}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#1F7A5C]" />
              </div>
            )}

            {/* E-books Grid */}
            {!isLoading && (
              <>
                {/* Free E-books */}
                {freeEbooks.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">🆓 Besplatno Dostupno</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {freeEbooks.map((ebook) => (
                        <EbookCard
                          key={ebook.id}
                          ebook={ebook}
                          isPremium={isPremium}
                          onDownload={handleDownload}
                          isDownloading={downloadingId === ebook.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Premium E-books */}
                {premiumEbooks.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {isPremium ? "🔒 Premium E-bookovi" : "🔒 Premium E-bookovi (Locked)"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {premiumEbooks.map((ebook) => (
                        <EbookCard
                          key={ebook.id}
                          ebook={ebook}
                          isPremium={isPremium}
                          onDownload={handleDownload}
                          isDownloading={downloadingId === ebook.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {ebooks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Nema e-bookova u ovoj kategoriji.
                    </p>
                  </div>
                )}

                {/* Lock Overlay for Free Users */}
                {!isPremium && premiumEbooks.length > 0 && (
                  <FeatureLock
                    title="Otkljucaj 7+ Premium E-bookova"
                    description="Upgrade na Premium za pristup cijeloj biblioteci e-bookova, meal prep vodiča, recepata i više."
                    features={[
                      "7+ premium e-bookova (meal prep, keto, dijete)",
                      "Mesečno novi ekskluzivni sadržaj",
                      "Printable templates i checkliste",
                      "Food swap charts",
                      "PDF download za offline čitanje",
                    ]}
                    variant="card"
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
