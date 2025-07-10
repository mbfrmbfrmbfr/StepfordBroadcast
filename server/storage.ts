import { users, categories, departments, articles, type User, type InsertUser, type Category, type InsertCategory, type Department, type InsertDepartment, type Article, type InsertArticle, type ArticleWithDetails } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Departments
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  deleteDepartment(id: number): Promise<void>;
  
  // Articles
  getArticles(limit?: number, offset?: number): Promise<ArticleWithDetails[]>;
  getArticle(id: number): Promise<ArticleWithDetails | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
  getBreakingNews(): Promise<ArticleWithDetails | undefined>;
  getPublishedArticles(limit?: number, offset?: number): Promise<ArticleWithDetails[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private departments: Map<number, Department> = new Map();
  private articles: Map<number, Article> = new Map();
  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentDepartmentId = 1;
  private currentArticleId = 1;

  constructor() {
    // Initialize with default data
    this.seedData();
  }

  private seedData() {
    // Create default admin user from environment variables
    const now = new Date();
    const defaultUser: User = {
      id: this.currentUserId++,
      email: process.env.DEFAULT_ADMIN_EMAIL || "admin@sbc.com",
      password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123", // In production, this should be hashed
      name: process.env.DEFAULT_ADMIN_NAME || "System Administrator",
      role: "admin",
      departmentId: null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create default categories
    const defaultCategories = [
      { name: "Politics", slug: "politics" },
      { name: "Business", slug: "business" },
      { name: "Technology", slug: "technology" },
      { name: "Sports", slug: "sports" },
      { name: "World", slug: "world" },
      { name: "Entertainment", slug: "entertainment" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = {
        id: this.currentCategoryId++,
        name: cat.name,
        slug: cat.slug,
      };
      this.categories.set(category.id, category);
    });

    // Create default departments
    const defaultDepartments = [
      { name: "SBC Verify", slug: "sbc-verify" },
      { name: "SBC Declassify", slug: "sbc-declassify" },
      { name: "SBC Investigative", slug: "sbc-investigative" },
      { name: "SBC International", slug: "sbc-international" },
    ];

    defaultDepartments.forEach(dept => {
      const department: Department = {
        id: this.currentDepartmentId++,
        name: dept.name,
        slug: dept.slug,
      };
      this.departments.set(department.id, department);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      role: insertUser.role || "editor",
      departmentId: insertUser.departmentId || null,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser: User = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    this.users.delete(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      id: this.currentCategoryId++,
    };
    this.categories.set(category.id, category);
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    this.categories.delete(id);
  }

  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const department: Department = {
      ...insertDepartment,
      id: this.currentDepartmentId++,
    };
    this.departments.set(department.id, department);
    return department;
  }

  async deleteDepartment(id: number): Promise<void> {
    this.departments.delete(id);
  }

  async getArticles(limit = 50, offset = 0): Promise<ArticleWithDetails[]> {
    const allArticles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);

    return allArticles.map(article => this.enrichArticle(article)).filter(Boolean) as ArticleWithDetails[];
  }

  async getPublishedArticles(limit = 50, offset = 0): Promise<ArticleWithDetails[]> {
    const publishedArticles = Array.from(this.articles.values())
      .filter(article => article.isPublished)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(offset, offset + limit);

    return publishedArticles.map(article => this.enrichArticle(article)).filter(Boolean) as ArticleWithDetails[];
  }

  async getArticle(id: number): Promise<ArticleWithDetails | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    return this.enrichArticle(article);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id: this.currentArticleId++,
      imageUrl: insertArticle.imageUrl || null,
      departmentId: insertArticle.departmentId || null,
      isBreaking: insertArticle.isBreaking || false,
      breakingText: insertArticle.breakingText || null,
      isPublished: insertArticle.isPublished || false,
      createdAt: now,
      updatedAt: now,
      publishedAt: insertArticle.isPublished ? now : null,
    };
    this.articles.set(article.id, article);
    return article;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article> {
    const article = this.articles.get(id);
    if (!article) throw new Error('Article not found');

    const updatedArticle: Article = {
      ...article,
      ...updateData,
      updatedAt: new Date(),
      publishedAt: updateData.isPublished && !article.publishedAt ? new Date() : article.publishedAt,
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<void> {
    this.articles.delete(id);
  }

  async getBreakingNews(): Promise<ArticleWithDetails | undefined> {
    const breakingArticle = Array.from(this.articles.values())
      .filter(article => article.isBreaking && article.isPublished)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())[0];

    if (!breakingArticle) return undefined;
    return this.enrichArticle(breakingArticle);
  }

  private enrichArticle(article: Article): ArticleWithDetails | undefined {
    const category = this.categories.get(article.categoryId);
    const department = article.departmentId ? this.departments.get(article.departmentId) || null : null;
    const author = this.users.get(article.authorId);

    if (!category || !author) return undefined;

    return {
      ...article,
      category,
      department,
      author,
    };
  }
}

export const storage = new MemStorage();
