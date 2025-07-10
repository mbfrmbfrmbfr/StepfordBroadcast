import { User } from "@shared/schema";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  setCurrentUser(user: AuthUser | null): void {
    this.currentUser = user;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.currentUser = null;
  }
}

export const authService = new AuthService();
