import { Switch, Route } from "wouter";
import { Analytics } from "@vercel/analytics/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "./hooks/useLanguage";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import BlogPost from "@/pages/BlogPost";
import Blog from "@/pages/Blog";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import AboutMe from "@/pages/AboutMe";
import NutricionistaLocation from "@/pages/NutricionistaLocation";
import NotFound from "@/pages/not-found";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/o-meni" component={AboutMe} />
      <Route path="/blog" component={Blog} />
      <Route path="/clanci/:slug" component={BlogPost} />
      <Route path="/uslovi-poslovanja" component={TermsOfService} />
      <Route path="/pravila-privatnosti" component={PrivacyPolicy} />
      <Route path="/kolacici" component={CookiePolicy} />
      <Route path="/nutricionista-prijedor" component={NutricionistaLocation} />
      <Route path="/nutricionista-sarajevo" component={NutricionistaLocation} />
      <Route path="/nutricionista-banja-luka" component={NutricionistaLocation} />
      <Route path="/nutricionista-tuzla" component={NutricionistaLocation} />
      <Route path="/nutricionista-zenica" component={NutricionistaLocation} />
      <Route path="/nutricionista-mostar" component={NutricionistaLocation} />
      <Route path="/nutricionista-bih" component={NutricionistaLocation} />
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
        <GoogleAnalytics />
        <Analytics />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;
