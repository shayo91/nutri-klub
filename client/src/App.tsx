import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "./hooks/useLanguage";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import BlogPost from "@/pages/BlogPost";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import Purchase from "@/pages/Purchase";
import AboutMe from "@/pages/AboutMe";
import NotFound from "@/pages/not-found";
import CookieConsent from "@/components/CookieConsent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutMe} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/purchase" component={Purchase} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
        <CookieConsent />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;
