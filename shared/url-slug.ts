/**
 * Normalize text to URL-safe slug (ASCII, no diacritics).
 * Handles BCS characters: č, ć, š, ž, đ and their uppercase variants.
 */
export function toUrlSlug(text: string): string {
	if (!text || typeof text !== 'string') return 'untitled'
	const diacriticsMap: Record<string, string> = {
		č: 'c',
		ć: 'c',
		š: 's',
		ž: 'z',
		đ: 'd',
		Č: 'c',
		Ć: 'c',
		Š: 's',
		Ž: 'z',
		Đ: 'd',
	}
	const normalized = text
		.split('')
		.map((c) => diacriticsMap[c] ?? c)
		.join('')
	return normalized
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/(^-|-$)/g, '')
}
