import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArticleWithDetails, Category, Department, insertDepartmentSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Plus, BarChart, FileText, Clock, Zap } from "lucide-react";
import ArticleForm from "@/components/article-form";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: articles = [], isLoading: articlesLoading } = useQuery<ArticleWithDetails[]>({
    queryKey: ["/api/articles"],
  });

  const { data: departments = [], isLoading: departmentsLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  const addDepartmentMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      return apiRequest("POST", "/api/departments", { name, slug });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Department added successfully",
      });
      setNewDepartmentName("");
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add department",
        variant: "destructive",
      });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/departments/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/departments"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      addDepartmentMutation.mutate(newDepartmentName.trim());
    }
  };

  const publishedArticles = articles.filter(a => a.isPublished);
  const draftArticles = articles.filter(a => !a.isPublished);
  const breakingArticles = articles.filter(a => a.isBreaking && a.isPublished);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Content Management Dashboard</h1>
          <Button
            onClick={() => authService.logout()}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Published Articles</h3>
                  <p className="text-3xl font-bold text-blue-600">{publishedArticles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Draft Articles</h3>
                  <p className="text-3xl font-bold text-green-600">{draftArticles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <BarChart className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900">Total Articles</h3>
                  <p className="text-3xl font-bold text-yellow-600">{articles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">Breaking News</h3>
                  <p className="text-3xl font-bold text-purple-600">{breakingArticles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Article Creation Form */}
        <ArticleForm />

        {/* Department Management */}
        <Card>
          <CardHeader>
            <CardTitle>Department Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddDepartment} className="flex space-x-2">
              <Input
                placeholder="Department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-[var(--sbc-green)] hover:bg-green-700"
                disabled={addDepartmentMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </form>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Current Departments</h4>
              {departmentsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {departments.map((department) => (
                    <div key={department.id} className="flex items-center justify-between bg-white p-3 rounded border">
                      <span className="font-medium">{department.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDepartmentMutation.mutate(department.id)}
                        disabled={deleteDepartmentMutation.isPending}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Articles Management */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No articles found. Create your first article above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.slice(0, 10).map((article) => (
                  <div key={article.id} className="bg-white p-4 rounded border flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{article.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {article.category.name}
                        </Badge>
                        {article.department && (
                          <Badge variant="outline" className="text-xs">
                            {article.department.name}
                          </Badge>
                        )}
                        {article.isBreaking && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Breaking
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {article.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[var(--sbc-blue)] hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteArticleMutation.mutate(article.id)}
                        disabled={deleteArticleMutation.isPending}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
