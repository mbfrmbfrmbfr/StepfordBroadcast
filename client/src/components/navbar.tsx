import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-[var(--sbc-blue)] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-white text-2xl font-bold">SBC</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <a href="#politics" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Politics
              </a>
              <a href="#business" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Business
              </a>
              <a href="#technology" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Technology
              </a>
              <a href="#sports" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sports
              </a>
              <a href="#world" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                World
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-blue-200 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700">
                    Dashboard
                  </Button>
                </Link>
                {authService.getCurrentUser()?.role === "admin" && (
                  <Link href="/users">
                    <Button variant="outline" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700">
                      Users
                    </Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="outline" className="bg-gray-600 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700">
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-[var(--sbc-light-blue)] text-white hover:bg-blue-600">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
