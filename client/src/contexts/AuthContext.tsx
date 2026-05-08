import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from 'react';

interface User {
	id: number;
	email: string;
	firstName?: string;
	lastName?: string;
	role: string;
	subscriptionStatus?: string;
	subscriptionTier?: string;
	subscriptionExpiresAt?: string;
	onboardingCompleted?: boolean;
	referralCode?: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	dashboardEnabled: boolean;
	configLoaded: boolean;
	isAuthenticated: boolean;
	isPremium: boolean;
	isAdmin: boolean;
	login: (email: string, password: string) => Promise<User>;
	register: (
		email: string,
		password: string,
		firstName?: string,
		lastName?: string,
	) => Promise<User>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchPublicConfig (): Promise<boolean> {
	try {
		const res = await fetch('/api/public-config', { cache: 'no-store' });
		if (!res.ok) return false;
		const data = (await res.json()) as { dashboardEnabled?: boolean };
		return data.dashboardEnabled === true;
	} catch {
		return false;
	}
}

export function AuthProvider ({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [dashboardEnabled, setDashboardEnabled] = useState(false);
	const [configLoaded, setConfigLoaded] = useState(false);

	const checkAuth = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/me', {
				credentials: 'include',
			});
			if (response.status === 503) {
				setUser(null);
				return;
			}
			if (response.ok) {
				const data = await response.json();
				setUser(data.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error('Failed to check auth:', error);
			setUser(null);
		}
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			const enabled = await fetchPublicConfig();
			if (cancelled) return;
			setDashboardEnabled(enabled);
			setConfigLoaded(true);
			if (!enabled) {
				setUser(null);
				setIsLoading(false);
				return;
			}
			setIsLoading(true);
			await checkAuth();
			if (!cancelled) setIsLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [checkAuth]);

	async function login (email: string, password: string) {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ email, password }),
		});
		const body = await response.json().catch(() => ({}));
		if (!response.ok) {
			throw new Error(
				body.message ||
					body.error ||
					'Prijava nije uspjela.',
			);
		}
		setUser(body.user as User);
		return body.user as User;
	}

	async function register (
		email: string,
		password: string,
		firstName?: string,
		lastName?: string,
	) {
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ email, password, firstName, lastName }),
		});
		const body = await response.json().catch(() => ({}));
		if (!response.ok) {
			throw new Error(
				body.message ||
					body.error ||
					'Registracija nije uspjela.',
			);
		}
		setUser(body.user as User);
		return body.user as User;
	}

	async function logout () {
		if (dashboardEnabled) {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
		}
		setUser(null);
	}

	async function refreshUser () {
		if (!dashboardEnabled) return;
		setIsLoading(true);
		await checkAuth();
		setIsLoading(false);
	}

	const value: AuthContextType = {
		user,
		isLoading,
		dashboardEnabled,
		configLoaded,
		isAuthenticated: !!user,
		isPremium:
			user?.role === 'premium' ||
			user?.role === 'admin',
		isAdmin: user?.role === 'admin',
		login,
		register,
		logout,
		refreshUser,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth () {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
