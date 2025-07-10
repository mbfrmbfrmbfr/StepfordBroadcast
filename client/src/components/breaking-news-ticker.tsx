import { useQuery } from "@tanstack/react-query";
import { ArticleWithDetails } from "@shared/schema";

export default function BreakingNewsTicker() {
  const { data: breakingNews, isLoading } = useQuery<ArticleWithDetails | null>({
    queryKey: ["/api/articles/breaking"],
  });

  if (isLoading || !breakingNews) {
    return null;
  }

  return (
    <div className="bg-[var(--sbc-red)] text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="bg-white text-[var(--sbc-red)] px-3 py-1 rounded text-sm font-bold mr-4">
            BREAKING
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="breaking-news-ticker">
              <span className="inline-block whitespace-nowrap animate-marquee">
                {breakingNews.breakingText || breakingNews.title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
