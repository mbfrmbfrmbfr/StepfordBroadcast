import { useQuery } from "@tanstack/react-query";
import { ArticleWithDetails } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/article-card";
import { useState } from "react";

export default function Home() {
  const [limit, setLimit] = useState(12);
  
  const { data: articles = [], isLoading, error } = useQuery<ArticleWithDetails[]>({
    queryKey: ["/api/articles/published", { limit }],
    queryFn: async () => {
      const response = await fetch(`/api/articles/published?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });

  const loadMore = () => {
    setLimit(prev => prev + 12);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Articles</h2>
          <p className="text-gray-600">Unable to load articles at this time. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {isLoading ? (
          <>
            {/* Featured story skeleton */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Skeleton className="w-full h-64" />
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            
            {/* Grid skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Articles Available</h2>
            <p className="text-gray-600">No published articles are currently available. Check back later for the latest news.</p>
          </div>
        ) : (
          <>
            {/* Featured Story */}
            {articles[0] && (
              <ArticleCard article={articles[0]} featured />
            )}

            {/* News Grid */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            <div className="text-center">
              <Button 
                onClick={loadMore}
                className="bg-[var(--sbc-blue)] text-white hover:bg-blue-800"
              >
                Load More Articles
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
