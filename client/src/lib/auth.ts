import { apiRequest } from "./queryClient";
import { User } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/login", { email, password });
  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem("token", data.token);
  
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/register", { name, email, password, role: "user" });
  const data = await response.json();
  
  // Store token in localStorage
  localStorage.setItem("token", data.token);
  
  return data;
}

export async function logout(): Promise<void> {
  // Remove token from localStorage
  localStorage.removeItem("token");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}
