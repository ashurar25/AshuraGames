import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Auth from "@/pages/auth";
import Profile from "@/pages/profile";
import Leaderboard from "@/pages/leaderboard";
import NotFound from "@/pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/auth" component={Auth} />
      <Route path="/profile" component={Profile} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;