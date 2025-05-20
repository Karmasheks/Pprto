import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Equipment from "@/pages/equipment";
import Users from "@/pages/users";
import Maintenance from "@/pages/maintenance";
import Reports from "@/pages/reports";
import { MobileSidebarProvider } from "@/hooks/use-mobile-sidebar";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/equipment" component={Equipment} />
      <Route path="/users" component={Users} />
      <Route path="/maintenance" component={Maintenance} />
      <Route path="/reports" component={Reports} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <MobileSidebarProvider>
            <Toaster />
            <Router />
          </MobileSidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
