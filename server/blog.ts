import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { toUrlSlug } from '../shared/url-slug.js'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

const DEFAULT_COVER =
	'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80'

interface ParsedPost {
	fileSlug: string
	title: string
	slug: string
	excerpt: string
	category: string
	categories: string[]
	image: string
	thumbnail: string
	date: string
	authorName: string
	body: string
}

function normalizeDateValue(value: unknown): string {
	if (typeof value === 'string' && value.trim()) {
		return value.trim()
	}
	if (value instanceof Date && !isNaN(value.getTime())) {
		return value.toISOString().split('T')[0]
	}
	return new Date().toISOString().split('T')[0]
}

function extractFirstMarkdownImage(markdown: string): string | null {
	const match = markdown.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/)
	if (!match) return null
	const raw = match[1]?.trim()
	return raw && !raw.startsWith('<') ? raw : null
}

function parsePostFile(filePath: string, fileBase: string): ParsedPost | null {
	const raw = fs.readFileSync(filePath, 'utf8')
	const { data, content } = matter(raw)
	const title = typeof data.title === 'string' ? data.title : ''
	if (!title.trim()) return null

	const slugRaw =
		typeof data.slug === 'string' && data.slug.trim()
			? data.slug.trim()
			: fileBase.replace(/\.md$/i, '')
	const slug = toUrlSlug(slugRaw)

	let categories: string[] = []
	if (Array.isArray(data.categories)) {
		categories = data.categories.filter((c: unknown) => typeof c === 'string')
	} else if (typeof data.category === 'string' && data.category.trim()) {
		categories = [data.category.trim()]
	}

	const category = categories[0] || 'Savjeti'
	const date = normalizeDateValue(data.date)
	const excerpt =
		typeof data.excerpt === 'string' ? data.excerpt : ''
	const image =
		typeof data.image === 'string' && data.image.trim()
			? data.image.trim()
			: DEFAULT_COVER
	const firstBodyImage = extractFirstMarkdownImage(
		typeof content === 'string' ? content : '',
	)
	const thumbnail =
		typeof data.thumbnail === 'string' && data.thumbnail.trim()
			? data.thumbnail.trim()
			: firstBodyImage || image
	const authorName =
		typeof data.author === 'string' && data.author.trim()
			? data.author.trim()
			: 'Jelena Matijaš'

	return {
		fileSlug: fileBase.replace(/\.md$/i, ''),
		title,
		slug,
		excerpt,
		category,
		categories: categories.length > 0 ? categories : [category],
		image,
		thumbnail,
		date,
		authorName,
		body: typeof content === 'string' ? content.trim() : '',
	}
}

function listMarkdownFiles(): string[] {
	if (!fs.existsSync(BLOG_DIR)) {
		console.warn(`[Blog] Directory missing: ${BLOG_DIR}`)
		return []
	}
	return fs
		.readdirSync(BLOG_DIR)
		.filter((f) => f.endsWith('.md'))
		.sort()
}

function loadAllParsed(): ParsedPost[] {
	const files = listMarkdownFiles()
	const posts: ParsedPost[] = []
	for (const file of files) {
		const full = path.join(BLOG_DIR, file)
		const parsed = parsePostFile(full, file)
		if (parsed) posts.push(parsed)
	}
	posts.sort((a, b) => {
		const da = new Date(a.date).getTime()
		const db = new Date(b.date).getTime()
		return db - da
	})
	return posts
}

export function getMarkdownBlogList(): {
	posts: ReturnType<typeof toListItem>[]
	categories: string[]
} {
	const parsed = loadAllParsed()
	const categoriesSet = new Set<string>()
	for (const p of parsed) {
		for (const c of p.categories) categoriesSet.add(c)
	}
	return {
		posts: parsed.map(toListItem),
		categories: Array.from(categoriesSet).sort(),
	}
}

function toListItem(p: ParsedPost) {
	return {
		id: p.slug,
		title: p.title,
		excerpt: p.excerpt,
		categories: p.categories,
		category: p.category,
		image: p.image,
		thumbnail: p.thumbnail,
		date: p.date,
		slug: p.slug,
		author: {
			name: p.authorName,
			avatar:
				'https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
		},
	}
}

export function getMarkdownBlogPostBySlug(slug: string): object | null {
	const normalized = toUrlSlug(slug)
	const parsed = loadAllParsed()
	const post = parsed.find((p) => p.slug === normalized)
	if (!post) return null

	return {
		id: post.slug,
		title: post.title,
		excerpt: post.excerpt,
		category: post.category,
		categories: post.categories,
		image: post.image,
		thumbnail: post.thumbnail,
		date: post.date,
		slug: post.slug,
		author: {
			name: post.authorName,
			avatar:
				'https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
		},
		bodyMarkdown: post.body,
	}
}
