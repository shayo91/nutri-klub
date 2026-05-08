import { Redirect, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardClosedPlaceholder } from '@/pages/DashboardClosed';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requirePremium?: boolean;
	requireAdmin?: boolean;
}

export function ProtectedRoute ({
	children,
	requirePremium = false,
	requireAdmin = false,
}: ProtectedRouteProps) {
	const {
		isAuthenticated,
		isPremium,
		isAdmin,
		isLoading,
		user,
		dashboardEnabled,
		configLoaded,
	} = useAuth();
	const [location] = useLocation();

	if (!configLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F7A5C]" />
			</div>
		);
	}

	if (!dashboardEnabled) {
		return <DashboardClosedPlaceholder />;
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Redirect to="/login" />;
	}

	if (
		isAuthenticated &&
		user &&
		!user.onboardingCompleted &&
		location !== '/onboarding'
	) {
		return <Redirect to="/onboarding" />;
	}

	if (requireAdmin && !isAdmin) {
		return <Redirect to="/dashboard" />;
	}

	if (requirePremium && !isPremium && !isAdmin) {
		return <Redirect to="/dashboard?upgrade=true" />;
	}

	return <>{children}</>;
}
