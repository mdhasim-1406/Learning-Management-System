import { useState, useEffect, useMemo } from 'react';
import { getArticles } from '../api';
import { AppLayout, PageHeader } from '../components/layout';
import { Card, Badge, Input, Skeleton } from '../components/ui';
import { cn, formatDate } from '../lib/utils';

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
      <PageHeader
        title="Knowledge Base"
        description={`${articles.length} articles to help you succeed`}
      />

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={SearchIcon}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="lg:col-span-1 space-y-2">
          {filteredArticles.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No articles found</p>
            </Card>
          ) : (
            filteredArticles.map(article => (
              <button
                key={article._id}
                onClick={() => setSelectedArticle(article)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-colors',
                  selectedArticle?._id === article._id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <h3 className="font-medium text-gray-900 line-clamp-1">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{article.category}</p>
              </button>
            ))
          )}
        </div>

        {/* Article Content */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <Card>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="primary" size="sm">{selectedArticle.category}</Badge>
                  {selectedArticle.tags?.map(tag => (
                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
                <p className="text-sm text-gray-500">
                  By {selectedArticle.author?.name || 'Admin'} • {formatDate(selectedArticle.createdAt)}
                </p>
              </div>
              <div className="prose prose-indigo max-w-none">
                <ArticleContent content={selectedArticle.content} />
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an article</h3>
              <p className="text-gray-500">Choose an article from the list to read its content</p>
            </Card>
          )}
        </div>
      </div>
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
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-4">
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
      elements.push(<h1 key={index} className="text-2xl font-bold mt-6 mb-4">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={index} className="text-xl font-bold mt-5 mb-3">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.match(/^\d+\. /)) {
      inList = true;
      const text = trimmed.replace(/^-\s+/, '').replace(/^\d+\.\s+/, '');
      listItems.push(formatInlineStyles(text));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={index} className="my-3 text-gray-700">{formatInlineStyles(trimmed)}</p>);
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
      return <strong key={i}>{part.slice(2, -2)}</strong>;
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
