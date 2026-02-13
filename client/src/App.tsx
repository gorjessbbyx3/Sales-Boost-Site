import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { useEffect } from "react";
import Home from "@/pages/home";
import PricingPage from "@/pages/pricing";
import HowItWorksPage from "@/pages/how-it-works";
import WebDesignPage from "@/pages/web-design";
import OnlineProcessingPage from "@/pages/online-processing";
import HighRiskPage from "@/pages/high-risk";
import ContactPage from "@/pages/contact";
import ConnectPage from "@/pages/connect";
import AiConfigPage from "@/pages/ai-config";
import NotFound from "@/pages/not-found";
import { ChatWidget } from "@/components/chat-widget";

const isAdminSubdomain = window.location.hostname.startsWith("admin.");

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return null;
}

function MainRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/our-work" component={WebDesignPage} />
        <Route path="/online-processing" component={OnlineProcessingPage} />
        <Route path="/high-risk" component={HighRiskPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/connect" component={ConnectPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/" component={AiConfigPage} />
      <Route component={AiConfigPage} />
    </Switch>
  );
}

function App() {
  if (isAdminSubdomain) {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <AdminRouter />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <MainRouter />
          <ChatWidget />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
