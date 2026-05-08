import { Download, Lock, FileText, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Ebook {
  id: number;
  title: string;
  description: string;
  author: string;
  category: string;
  pages: number;
  coverImageUrl: string;
  fileSize: number;
  isPremium: boolean;
  isFeatured: boolean;
  downloadCount: number;
}

interface EbookCardProps {
  ebook: Ebook;
  isPremium?: boolean;
  onDownload?: (ebookId: number) => void;
  isDownloading?: boolean;
}

export function EbookCard({
  ebook,
  isPremium = false,
  onDownload,
  isDownloading = false,
}: EbookCardProps) {
  const isLocked = ebook.isPremium && !isPremium;
  const fileSizeMB = (ebook.fileSize / 1024).toFixed(1);

  const categoryColors: Record<string, string> = {
    guides: "bg-blue-100 text-blue-800",
    keto: "bg-purple-100 text-purple-800",
    meal_prep: "bg-green-100 text-green-800",
    recipes: "bg-orange-100 text-orange-800",
    weight_loss: "bg-red-100 text-red-800",
  };

  const categoryColor = categoryColors[ebook.category] || "bg-gray-100 text-gray-800";

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={ebook.coverImageUrl || "https://via.placeholder.com/400x600"}
          alt={ebook.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm font-medium">Premium</p>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {ebook.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
            <Star className="w-3 h-3 mr-1 fill-white" />
            Featured
          </Badge>
        )}

        {/* Category Badge */}
        <Badge className={`absolute top-2 right-2 ${categoryColor}`}>
          {ebook.category}
        </Badge>

        {/* Free Badge */}
        {!ebook.isPremium && (
          <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
            🆓 FREE
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#1F7A5C] transition-colors">
          {ebook.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          by {ebook.author}
        </p>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {ebook.description}
        </p>

        {/* E-book Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{ebook.pages} str.</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{ebook.downloadCount}</span>
          </div>
          <span>{fileSizeMB} MB</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        {isLocked ? (
          <Button
            className="w-full bg-[#1F7A5C] hover:bg-[#185A44]"
            onClick={() => window.location.href = "/dashboard/upgrade"}
          >
            <Lock className="w-4 h-4 mr-2" />
            Aktiviraj Premium
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full hover:bg-[#1F7A5C] hover:text-white transition-colors"
            onClick={() => onDownload?.(ebook.id)}
            disabled={isDownloading}
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Preuzimanje..." : "Preuzmi PDF"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
