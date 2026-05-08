import { Switch, Route, Redirect } from 'wouter';
import { Analytics } from '@vercel/analytics/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/useLanguage';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import BlogPost from '@/pages/BlogPost';
import Blog from '@/pages/Blog';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import AboutMe from '@/pages/AboutMe';
import NutricionistaLocation from '@/pages/NutricionistaLocation';
import NotFound from '@/pages/not-found';
import CookieConsent from '@/components/CookieConsent';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Recipes from '@/pages/dashboard/Recipes';
import RecipeDetail from '@/pages/dashboard/RecipeDetail';
import Ebooks from '@/pages/dashboard/Ebooks';
import RecipeOfTheDay from '@/pages/dashboard/RecipeOfTheDay';
import AIAssistant from '@/pages/dashboard/AIAssistant';
import Settings from '@/pages/dashboard/Settings';
import Upgrade from '@/pages/dashboard/Upgrade';
import Progress from '@/pages/dashboard/Progress';
import AdminRecipes from '@/pages/dashboard/AdminRecipes';
import MyPlan from '@/pages/dashboard/MyPlan';
import SearchResults from '@/pages/dashboard/SearchResults';
import CheckoutMock from '@/pages/dashboard/CheckoutMock';
import PaymentSuccess from '@/pages/dashboard/PaymentSuccess';

function Router () {
	return (
		<Switch>
			<Route path="/">
				{() => (
					<Layout>
						<Home />
					</Layout>
				)}
			</Route>
			<Route path="/o-meni">
				{() => (
					<Layout>
						<AboutMe />
					</Layout>
				)}
			</Route>
			<Route path="/blog">
				{() => (
					<Layout>
						<Blog />
					</Layout>
				)}
			</Route>
			<Route path="/clanci/:slug">
				{() => (
					<Layout>
						<BlogPost />
					</Layout>
				)}
			</Route>
			<Route path="/uslovi-poslovanja">
				{() => (
					<Layout>
						<TermsOfService />
					</Layout>
				)}
			</Route>
			<Route path="/pravila-privatnosti">
				{() => (
					<Layout>
						<PrivacyPolicy />
					</Layout>
				)}
			</Route>
			<Route path="/kolacici">
				{() => (
					<Layout>
						<CookiePolicy />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-prijedor">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-sarajevo">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-banja-luka">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-tuzla">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-zenica">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-mostar">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>
			<Route path="/nutricionista-bih">
				{() => (
					<Layout>
						<NutricionistaLocation />
					</Layout>
				)}
			</Route>

			<Route path="/login" component={Login} />
			<Route path="/register" component={Register} />
			<Route path="/forgot-password" component={ForgotPassword} />

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
			<Route path="/dashboard/recipes/:id">
				{() => (
					<ProtectedRoute>
						<RecipeDetail />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/ebooks">
				{() => (
					<ProtectedRoute>
						<Ebooks />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/recipe-of-the-day">
				{() => (
					<ProtectedRoute>
						<RecipeOfTheDay />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/ai-assistant">
				{() => (
					<ProtectedRoute>
						<AIAssistant />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/settings">
				{() => (
					<ProtectedRoute>
						<Settings />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/admin/recipes">
				{() => (
					<ProtectedRoute requireAdmin>
						<AdminRecipes />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/my-plan">
				{() => (
					<ProtectedRoute>
						<MyPlan />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/search">
				{() => (
					<ProtectedRoute>
						<SearchResults />
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
			<Route path="/dashboard/progress">
				{() => (
					<ProtectedRoute>
						<Progress />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/checkout-mock">
				{() => (
					<ProtectedRoute>
						<CheckoutMock />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/success">
				{() => (
					<ProtectedRoute>
						<Redirect to="/dashboard/payment-success" />
					</ProtectedRoute>
				)}
			</Route>
			<Route path="/dashboard/payment-success">
				{() => (
					<ProtectedRoute>
						<PaymentSuccess />
					</ProtectedRoute>
				)}
			</Route>

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

function App () {
	return (
		<LanguageProvider>
			<AuthProvider>
				<TooltipProvider>
					<Router />
					<Toaster />
					<CookieConsent />
					<GoogleAnalytics />
					<Analytics />
				</TooltipProvider>
			</AuthProvider>
		</LanguageProvider>
	);
}

export default App;
