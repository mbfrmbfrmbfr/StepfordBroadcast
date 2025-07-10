import { ArticleWithDetails } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";

interface ArticleCardProps {
  article: ArticleWithDetails;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return "Yesterday";
    return d.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      politics: "bg-blue-100 text-blue-800",
      business: "bg-green-100 text-green-800",
      technology: "bg-purple-100 text-purple-800",
      sports: "bg-orange-100 text-orange-800",
      world: "bg-red-100 text-red-800",
      entertainment: "bg-pink-100 text-pink-800",
    };
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (featured) {
    return (
      <Card className="overflow-hidden shadow-lg">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        )}
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Badge className={getCategoryColor(article.category.name)}>
              {article.category.name}
            </Badge>
            {article.department && (
              <span className="text-[var(--sbc-gray)] text-sm">
                {article.department.name}
              </span>
            )}
            <span className="text-[var(--sbc-gray)] text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--sbc-charcoal)] mb-4">
            {article.title}
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            {article.summary}
          </p>
          <div className="flex items-center text-sm text-[var(--sbc-gray)]">
            <User className="h-4 w-4 mr-1" />
            By {article.author.name}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Badge className={getCategoryColor(article.category.name)}>
            {article.category.name}
          </Badge>
          <span className="text-gray-500 text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {article.summary}
        </p>
        <div className="text-xs text-gray-500 flex items-center">
          <User className="h-3 w-3 mr-1" />
          By {article.author.name}
        </div>
      </CardContent>
    </Card>
  );
}
