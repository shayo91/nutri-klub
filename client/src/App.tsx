import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "./hooks/useLanguage";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import BlogPost from "@/pages/BlogPost";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import Purchase from "@/pages/Purchase";
import TestimonialsPage from "@/pages/TestimonialsPage";
import AboutMe from "@/pages/AboutMe";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Recipes from "@/pages/dashboard/Recipes";
import Upgrade from "@/pages/dashboard/Upgrade";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes with Layout */}
      <Route path="/">
        {() => (
          <Layout>
            <Home />
          </Layout>
        )}
      </Route>
      <Route path="/about">
        {() => (
          <Layout>
            <AboutMe />
          </Layout>
        )}
      </Route>
      <Route path="/blog/:slug">
        {(params) => (
          <Layout>
            <BlogPost {...params} />
          </Layout>
        )}
      </Route>
      <Route path="/testimonials">
        {() => (
          <Layout>
            <TestimonialsPage />
          </Layout>
        )}
      </Route>
      <Route path="/purchase">
        {() => (
          <Layout>
            <Purchase />
          </Layout>
        )}
      </Route>
      <Route path="/terms">
        {() => (
          <Layout>
            <TermsOfService />
          </Layout>
        )}
      </Route>
      <Route path="/privacy">
        {() => (
          <Layout>
            <PrivacyPolicy />
          </Layout>
        )}
      </Route>
      <Route path="/cookies">
        {() => (
          <Layout>
            <CookiePolicy />
          </Layout>
        )}
      </Route>
      
      {/* Auth routes without Layout (standalone pages) */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Protected routes without Layout (have their own headers) */}
      <Route path="/onboarding">
        {() => (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/recipes">
        {() => (
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/upgrade">
        {() => (
          <ProtectedRoute>
            <Upgrade />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* 404 with Layout */}
      <Route>
        {() => (
          <Layout>
            <NotFound />
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
