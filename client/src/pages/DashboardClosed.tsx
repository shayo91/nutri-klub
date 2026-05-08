import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

/**
 * Shown when ENABLE_DASHBOARD is off and user opens a dashboard route.
 */
export function DashboardClosedPlaceholder () {
	return (
		<div className="min-h-screen bg-gradient-to-b from-[#E8F5F0] to-white flex flex-col items-center justify-center px-4 py-16">
			<div className="max-w-md w-full rounded-2xl bg-white shadow-lg border border-[#1F7A5C]/20 p-8 text-center space-y-6">
				<h1 className="text-2xl font-bold text-[#1A1A1A]">
					Korisnički panel uskoro
				</h1>
				<p className="text-gray-600 leading-relaxed">
					Personalizovani panel (recepti, plan, praćenje) trenutno nije
					aktivan. Pratite nas ili se vratite na početnu za javni sadržaj.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link href="/">
						<Button className="w-full sm:w-auto bg-[#1F7A5C] hover:bg-[#145042]">
							Početna
						</Button>
					</Link>
					<Link href="/blog">
						<Button variant="outline" className="w-full sm:w-auto">
							Blog
						</Button>
					</Link>
				</div>
				<p className="text-xs text-gray-400">
					Ako ste administrator, uključite{' '}
					<code className="bg-gray-100 px-1 rounded">ENABLE_DASHBOARD=true</code>{' '}
					na serveru.
				</p>
			</div>
		</div>
	);
}
