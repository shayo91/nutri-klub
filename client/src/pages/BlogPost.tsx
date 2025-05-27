import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  content: string;
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

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      fetchBlogPost(params.slug);
    }
  }, [params?.slug]);

  const fetchBlogPost = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog-posts');
      if (response.ok) {
        const posts = await response.json();
        const foundPost = posts.find((p: BlogPost) => 
          p.slug === slug || 
          p.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') === slug
        );
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError(true);
        }
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
            <a className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nazad na blog
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero sekcija */}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title}
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
              <a className="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
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

            {/* Sadržaj */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>

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