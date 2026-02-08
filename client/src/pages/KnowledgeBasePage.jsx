import { useState, useEffect, useMemo } from 'react';
import { getArticles } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import { Card, Badge, Input, Skeleton } from '../components/ui-next';
import { cn, formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeInUp } from '../lib/animations';

const KnowledgeBasePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return ['all', ...Array.from(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.content?.toLowerCase().includes(search.toLowerCase()) ||
        article.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, search, selectedCategory]);

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Knowledge Base" description="Find answers and guides" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        <PageHeader
          title="Knowledge Base"
          description={`${articles.length} articles to help you succeed`}
        />

        {/* Search and Filters */}
        <Card className="mb-6 border-stone-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={SearchIcon}
                className="focus:ring-emerald-500 border-stone-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md transform scale-105'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article List */}
          <div className="lg:col-span-1 space-y-3">
            <AnimatePresence mode="wait">
              {filteredArticles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="text-center py-8">
                    <p className="text-stone-500">No articles found</p>
                  </Card>
                </motion.div>
              ) : (
                filteredArticles.map((article, index) => (
                  <motion.button
                    key={article._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedArticle(article)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border transition-all duration-200',
                      selectedArticle?._id === article._id
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm scale-[1.02]'
                        : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50'
                    )}
                  >
                    <h3 className={cn(
                      "font-semibold line-clamp-1",
                      selectedArticle?._id === article._id ? "text-emerald-900" : "text-stone-900"
                    )}>
                      {article.title}
                    </h3>
                    <p className={cn(
                      "text-sm mt-1 font-medium",
                      selectedArticle?._id === article._id ? "text-emerald-700" : "text-stone-500"
                    )}>
                      {article.category}
                    </p>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Article Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedArticle ? (
                <motion.div
                  key={selectedArticle._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-stone-200 min-h-[500px]">
                    <div className="mb-6 pb-6 border-b border-stone-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="success" size="sm" className="bg-emerald-100 text-emerald-800">{selectedArticle.category}</Badge>
                        {selectedArticle.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" size="sm" className="bg-stone-100 text-stone-600">{tag}</Badge>
                        ))}
                      </div>
                      <h1 className="text-3xl font-bold text-stone-900 mb-3">{selectedArticle.title}</h1>
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <span className="font-medium text-stone-900">By {selectedArticle.author?.name || 'Admin'}</span>
                        <span>•</span>
                        <span>{formatDate(selectedArticle.createdAt)}</span>
                      </div>
                    </div>
                    <div className="prose prose-stone prose-emerald max-w-none">
                      <ArticleContent content={selectedArticle.content} />
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className="text-center py-20 flex flex-col items-center justify-center min-h-[500px] border-stone-200 border-dashed">
                    <div className="text-6xl mb-6 opacity-80">📚</div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Select an article</h3>
                    <p className="text-stone-500 max-w-sm mx-auto">
                      Choose an article from the list to view its content and details
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

// Simple markdown-like renderer
function ArticleContent({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-4 text-stone-700 marker:text-emerald-500">
          {listItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-stone-900">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-bold mt-6 mb-3 text-stone-800">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold mt-5 mb-2 text-stone-800">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.match(/^\d+\. /)) {
      inList = true;
      const text = trimmed.replace(/^-\s+/, '').replace(/^\d+\.\s+/, '');
      listItems.push(formatInlineStyles(text));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={index} className="my-3 text-stone-600 leading-relaxed">{formatInlineStyles(trimmed)}</p>);
    }
  });

  flushList();

  return <>{elements}</>;
}

function formatInlineStyles(text) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export default KnowledgeBasePage;
