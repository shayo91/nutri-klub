import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";

interface TextBlock {
  text: string;
  bold?: boolean;
  italic?: boolean;
  link?: string | null;
}

interface ContentBlock {
  id: string;
  type: string;
  content?: string | TextBlock[];
  url?: string;
  caption?: string;
  icon?: string;
}

interface BlogPostData {
  id: string;
  title: string;
  content: ContentBlock[];
  excerpt: string;
  category: string;
  image: string;
  date: string;
  slug: string;
  author: {
    name: string;
    avatar?: string;
  };
}

function RenderTextSegment({ segment, index }: { segment: TextBlock; index: number }) {
  let content: JSX.Element = <span>{segment.text}</span>;
  
  if (segment.bold && segment.italic) {
    content = <strong><em>{segment.text}</em></strong>;
  } else if (segment.bold) {
    content = <strong>{segment.text}</strong>;
  } else if (segment.italic) {
    content = <em>{segment.text}</em>;
  }
  
  if (segment.link) {
    return (
      <a key={index} href={segment.link} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  
  return <span key={index}>{content}</span>;
}

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      if (Array.isArray(block.content)) {
        return (
          <p className="text-gray-700 leading-relaxed mb-4">
            {block.content.map((segment, i) => (
              <RenderTextSegment key={i} segment={segment} index={i} />
            ))}
          </p>
        );
      }
      return <p className="text-gray-700 leading-relaxed mb-4">{String(block.content || "")}</p>;

    case "heading_1":
      return <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{String(block.content)}</h2>;

    case "heading_2":
      return <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{String(block.content)}</h3>;

    case "heading_3":
      return <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{String(block.content)}</h4>;

    case "bulleted_list_item":
    case "numbered_list_item":
      return null;

    case "image":
      return (
        <figure className="my-6">
          <img
            src={block.url}
            alt={block.caption || "Blog slika nutricionista ishrana BiH"}
            className="w-full rounded-lg shadow-md"
            width={800}
            height={450}
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-gray-600">
          {String(block.content)}
        </blockquote>
      );

    case "callout":
      return (
        <div className="bg-gray-100 rounded-lg p-4 my-4 flex items-start">
          {block.icon && <span className="mr-3 text-xl">{block.icon}</span>}
          <p className="text-gray-700">{String(block.content)}</p>
        </div>
      );

    case "divider":
      return <hr className="my-8 border-gray-200" />;

    default:
      return null;
  }
}

function RenderContent({ blocks }: { blocks: ContentBlock[] }) {
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const listItems: ContentBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        listItems.push(blocks[i]);
        i++;
      }
      elements.push(
        <ul key={`ul-${listItems[0].id}`} className="list-disc ml-6 mb-4 space-y-2">
          {listItems.map((item) => (
            <li key={item.id} className="text-gray-700 leading-relaxed">
              {String(item.content)}
            </li>
          ))}
        </ul>
      );
    } else if (block.type === "numbered_list_item") {
      const listItems: ContentBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        listItems.push(blocks[i]);
        i++;
      }
      elements.push(
        <ol key={`ol-${listItems[0].id}`} className="list-decimal ml-6 mb-4 space-y-2">
          {listItems.map((item) => (
            <li key={item.id} className="text-gray-700 leading-relaxed">
              {String(item.content)}
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(<RenderBlock key={block.id} block={block} />);
      i++;
    }
  }

  return <>{elements}</>;
}

export default function BlogPost() {
  const [, params] = useRoute("/clanci/:slug");
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (params?.slug) {
      fetchBlogPost(params.slug);
    }
  }, [params?.slug]);

  const fetchBlogPost = async (slug: string) => {
    try {
      setLoading(true);
      const trimmedSlug = slug.trim();
      if (!trimmedSlug) {
        setError(true);
        return;
      }
      const isNotionId = /^[a-f0-9]{32}$/i.test(trimmedSlug);
      const url = isNotionId
        ? `/api/blog-posts/${trimmedSlug}`
        : `/api/blog-posts/by-slug/${encodeURIComponent(trimmedSlug)}`;
      const response = await fetch(url);
      if (response.ok) {
        const fullPost = await response.json();
        setPost(fullPost);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam članak...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Članak nije pronađen</h1>
          <p className="text-gray-600 mb-8">Žao nam je, traženi članak ne postoji ili je uklonjen.</p>
          <Link href="/#blog">
            <a className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nazad na blog
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const hasContent = Array.isArray(post.content) && post.content.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{post.title} | Nutricionista Jelena Matijaš</title>
        <meta name="description" content={post.excerpt || `${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`} />
        <meta property="og:title" content={`${post.title} | Nutricionista Jelena Matijaš`} />
        <meta property="og:description" content={post.excerpt || `${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`} />
        <meta property="og:type" content="article" />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:locale" content="bs_BA" />
        <link rel="canonical" href={`https://nutricionistajelena.ba/clanci/${post.slug}`} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.date && (() => {
					const d = new Date(post.date);
					return !isNaN(d.getTime()) ? (
						<meta property="article:published_time" content={d.toISOString()} />
					) : null;
				})()}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Nutricionista Jelena Matijaš`} />
        <meta name="twitter:description" content={post.excerpt || `${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt || `${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`,
          "image": post.image || "",
          "author": {
            "@type": "Person",
            "name": post.author.name,
            "jobTitle": "Magistar nutricionizma",
            "url": "https://nutricionistajelena.ba/o-meni"
          },
          "publisher": {
            "@type": "Organization",
            "name": "NutriKlub",
            "url": "https://nutricionistajelena.ba",
            "logo": {
              "@type": "ImageObject",
              "url": "https://nutricionistajelena.ba/attached_assets/jelena-hero.png"
            }
          },
          "datePublished": post.date ? new Date(post.date).toISOString() : undefined,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://nutricionistajelena.ba/clanci/${post.slug}`
          },
          "articleSection": post.category,
          "inLanguage": "bs"
        })}</script>
      </Helmet>
      {/* Hero sekcija */}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        {post.image && (
          <img
            src={post.image}
            alt={`${post.title} - blog nutricionista Jelena Matijaš`}
            width={1200}
            height={630}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {post.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('sr-RS')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sadržaj članka */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigacija */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/#blog">
              <a className="inline-flex items-center text-primary hover:text-primary-hover transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nazad na blog
              </a>
            </Link>
          </motion.div>

          {/* Glavni sadržaj */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            {/* Excerpt */}
            {post.excerpt && (
              <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-primary">
                {post.excerpt}
              </div>
            )}

            {/* Sadržaj iz Notion blokova */}
            {hasContent ? (
              <div className="prose prose-lg max-w-none">
                <RenderContent blocks={post.content} />
              </div>
            ) : (
              <div className="text-gray-600 text-center py-8">
                <p>Sadržaj članka će uskoro biti dostupan.</p>
              </div>
            )}

            {/* Autor info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{post.author.name}</h3>
                  <p className="text-gray-600">Sertifikovani nutricionista</p>
                </div>
              </div>
            </div>
          </motion.article>

          {/* CTA sekcija */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Želite personalizovan plan ishrane?</h2>
            <p className="text-lg mb-6 opacity-90">
              Zakažite konsultaciju i početkite putovanje ka zdravijem življenju
            </p>
            <Link href="/#contact">
              <a className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Zakažite Konsultaciju
              </a>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
