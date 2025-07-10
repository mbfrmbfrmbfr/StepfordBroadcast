import { User } from "@shared/schema";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private readonly STORAGE_KEY = 'sbc_user';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      if (this.currentUser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  setCurrentUser(user: AuthUser | null): void {
    this.currentUser = user;
    this.saveToStorage();
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.currentUser = null;
    this.saveToStorage();
  }
}

export const authService = new AuthService();
