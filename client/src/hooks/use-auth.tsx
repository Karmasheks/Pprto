import { createContext, useContext, useEffect, useState } from "react";
import { getToken, logout } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
  isAuthenticated: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const token = getToken();

  const { 
    data: user, 
    isLoading: isLoadingUser,
    refetch 
  } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: !!token,
  });

  // Initial auth check on page load
  useEffect(() => {
    async function initializeAuth() {
      if (token) {
        await refetch();
      }
      setIsInitializing(false);
    }
    
    initializeAuth();
  }, [token, refetch]);

  const isLoading = isInitializing || isLoadingUser;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const checkIsAuthenticated = () => {
    return !!token && !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        logout: handleLogout,
        isAuthenticated: checkIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
