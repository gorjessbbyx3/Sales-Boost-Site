import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Home from "@/pages/home";
import PricingPage from "@/pages/pricing";
import HowItWorksPage from "@/pages/how-it-works";
import WebDesignPage from "@/pages/web-design";
import HighRiskPage from "@/pages/high-risk";
import ContactPage from "@/pages/contact";
import AiConfigPage from "@/pages/ai-config";
import NotFound from "@/pages/not-found";
import { ChatWidget } from "@/components/chat-widget";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/how-it-works" component={HowItWorksPage} />
        <Route path="/web-design" component={WebDesignPage} />
        <Route path="/high-risk" component={HighRiskPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/ai-config" component={AiConfigPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
