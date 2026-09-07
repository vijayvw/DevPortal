import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Eye,
  Star,
  Code,
  Database,
  Cloud,
  Shield,
  Heart,
} from 'lucide-react';
import {
  AnimatedBackground,
  TechBadge,
  LoadingSkeleton,
  StatsCard,
  CategoryFilter,
  ViewToggle,
  EngagementMetrics,
  categoryColors
} from '../visual/VisualComponents';
import {
  useBlogPosts,
  useBlogPost,
  useLikeBlog,
  useUnlikeBlog,
} from '../../queries/useBlogPosts';
import { ErrorState } from '../states/ErrorState';
import { EmptyState } from '../states/EmptyState';
import type { BlogPostListItemDto, BlogPostDetailDto } from '../../api/types';
import { X } from "lucide-react";
import { createPortal } from 'react-dom';
import { calculateReadingTime } from "../../utils/readingTime";

/**
 * View-model adapting the backend's BlogPostListItemDto/BlogPostDetailDto
 * to the field names this component's JSX already uses throughout
 * (readTime, date, views/likes/comments as display-ready values) — this
 * keeps the ~450 lines of JSX below essentially untouched; only the data
 * source and this adapter layer are new.
 */
interface BlogPostViewModel {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  date: string;
  featured: boolean;
  views: number;
  likes: number;
  comments: number;
  excerpt: string;
  tags: string[];
  heroImage?: string;
}

function formatCount(n: number): string {
  return n > 999 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function toViewModel(dto: BlogPostListItemDto): BlogPostViewModel {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    category: dto.category,
    difficulty: dto.difficulty as BlogPostViewModel['difficulty'],
    readTime: `${dto.readTimeMinutes} min read`,
    date: dto.publishedAt ?? '',
    featured: dto.featured,
    views: dto.views,
    likes: dto.likes,
    comments: dto.commentsCount,
    excerpt: dto.excerpt,
    tags: dto.tags,
    heroImage: dto.heroImageUrl ?? undefined,
  };
}

const categoryBadge = (category: string) => category as keyof typeof categoryColors;

const EnhancedBlog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useBlogPosts({ limit: 100 });
  const posts = useMemo(() => (data?.data ?? []).map(toViewModel), [data]);

  const detailQuery = useBlogPost(selectedSlug ?? undefined);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category)));
    return ['All', ...unique];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [posts, selectedCategory, searchTerm, sortBy]);

  const featuredPosts = posts.filter(post => post.featured);

  const handlePostClick = (post: BlogPostViewModel) => {
    setSelectedSlug(post.slug);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
    
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            TECH_LOGS
          </h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Real-world learning notes, Kubernetes labs, cloud infrastructure experiments, DevOps automation, and cybersecurity insights.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <StatsCard
            title="Tech Domains"
            value="6"
            icon={<Cloud className="w-6 h-6" />}
            color="completed"
          />

          <StatsCard
            title="Core Focus"
            value="DevOps"
            change="Cloud Native & Automation"
            icon={<Code className="w-6 h-6" />}
            color="completed"
            trend="up"
          />

          <StatsCard
            title="Learning"
            value="Kubernetes"
            change="GitOps & Security"
            icon={<Shield className="w-6 h-6" />}
            color="completed"
            trend="up"
          />

          <StatsCard
            title="Platforms"
            value="AWS"
            change="Docker • Terraform"
            icon={<Database className="w-6 h-6" />}
            color="completed"
            trend="up"
          />

        </motion.div>

        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[0, 1].map((i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <LoadingSkeleton lines={4} />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && (
          <>
            {/* Featured Posts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Latest Learning Logs
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handlePostClick(post)}
                    className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <TechBadge name={post.category} category={categoryBadge(post.category)} size="sm" />
                        <span className="text-xs text-yellow-400 font-medium">⭐ Featured</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <EngagementMetrics
                          views={formatCount(post.views)}
                          likes={String(post.likes)}
                          comments={String(post.comments)}
                          featured={post.featured}
                        />

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{post.readTime}</span>
                          <span>{post.date ? new Date(post.date).toLocaleDateString() : ''}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>

            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
              </div>

              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <ViewToggle view={view} onViewChange={setView} />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes')}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="date">Latest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
              </select>
            </motion.div>

            {/* Blog Posts Grid/List */}
            {createPortal(
              <AnimatePresence>
                {selectedSlug && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md"
                    onClick={() => setSelectedSlug(null)}
                  >
                    <div className="flex h-full items-center justify-center p-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl h-[95vh] rounded-2xl overflow-hidden flex flex-col bg-bg-surface border border-neutral-700"
                      >
                        {detailQuery.isLoading && (
                          <div className="p-6">
                            <LoadingSkeleton lines={6} />
                          </div>
                        )}

                        {detailQuery.isError && (
                          <div className="p-6">
                            <ErrorState
                              message={
                                detailQuery.error instanceof Error
                                  ? detailQuery.error.message
                                  : undefined
                              }
                              onRetry={() => detailQuery.refetch()}
                            />
                          </div>
                        )}

                        {detailQuery.data && (
                          <BlogPostModalContent
                            post={detailQuery.data}
                            onClose={() => setSelectedSlug(null)}
                          />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )}

            {filteredPosts.length === 0 && (
              <EmptyState message="No articles found. Try adjusting your search or filter criteria." />
            )}
          </>
        )}

        {filteredPosts.length > 0 && (
  <div
    className={
      view === "grid"
        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-6"
    }
  >
    {filteredPosts.map((post) => (
      <motion.article
        key={post.id}
        whileHover={{ scale: 1.02 }}
        onClick={() => handlePostClick(post)}
        className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden cursor-pointer group"
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <TechBadge
              name={post.category}
              category={categoryBadge(post.category)}
              size="sm"
            />

            {post.featured && (
              <span className="text-xs text-yellow-400 font-medium">
                ⭐ Featured
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400">
            {post.title}
          </h3>

          <p className="text-gray-400 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <EngagementMetrics
              views={formatCount(post.views)}
              likes={String(post.likes)}
              comments={String(post.comments)}
              featured={post.featured}
            />

            <span>{post.readTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    ))}
  </div>
)}
      </div>
  );
};
  
/**
 * Modal body, split out for readability now that it operates on the
 * live BlogPostDetailDto rather than a field of the parent's state.
 * Rendering logic (naive markdown-ish line parsing) is unchanged from
 * the original — the backend stores the same kind of plain-markdown
 * content the static array used to hardcode.
 */
function BlogPostModalContent({
  post,
  onClose,
}: {
  post: BlogPostDetailDto;
  onClose: () => void;
}) {
    const heroImageSrc = post.heroImageUrl ?? null;

    const likeMutation = useLikeBlog();
    const unlikeMutation = useUnlikeBlog();

    const likedKey = `liked-blog-${post.slug}`;

    const [liked, setLiked] = useState(false);

    useEffect(() => {
      setLiked(localStorage.getItem(likedKey) === "true");
    }, [likedKey]);

  return (
  <div className="flex h-full flex-col">

    <div className="relative h-80 shrink-0 overflow-hidden">
        {heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/40 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8">

          <div className="flex items-center gap-3 mb-4">

            <TechBadge
              name={post.category}
              category={categoryBadge(post.category)}
              size="sm"
            />

            <span
              className={`px-2 py-1 text-xs rounded ${
                post.difficulty === "Beginner"
                  ? "bg-green-500/20 text-green-400"
                  : post.difficulty === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {post.difficulty}
            </span>

            {post.featured && (
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : ""}
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {calculateReadingTime(
                `${post.excerpt ?? ""} ${post.contentMarkdown ?? ""}`
              )}{" "}
              min read
            </div>

            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {formatCount(post.views)} views
            </div>

            <motion.button
              whileTap={{ scale: 0.85 }}
              animate={
                liked
                  ? {
                      scale: [1, 1.25, 1],
                    }
                  : {
                      scale: 1,
                    }
              }
              transition={{ duration: 0.25 }}
              onClick={() => {
                if (liked) {
                  unlikeMutation.mutate(post.slug);
                  localStorage.removeItem(likedKey);
                  setLiked(false);
                } else {
                  likeMutation.mutate(post.slug);
                  localStorage.setItem(likedKey, "true");
                  setLiked(true);
                }
              }}
              className={`flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-300 ${
                liked
                  ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <Heart
                size={18}
                className={`transition-all duration-300 ${
                  liked ? "fill-green-400 text-green-400" : ""
                }`}
              />

              <motion.span
                key={post.likes}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {post.likes}
              </motion.span>
            </motion.button>

              

          </div>

        </div>

      </div>
      {/* Article */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
        <p className="text-lg leading-relaxed text-neutral-300">

  {post.excerpt}

</p>

{/* Tags */}

<div className="mb-8 mt-6 flex flex-wrap gap-2">

  {post.tags.map((tag) => (

    <span

      key={tag}

      className="rounded-full bg-gray-800 px-3 py-1 text-sm text-green-400 border border-green-500/20"

    >

      #{tag}

    </span>

  ))}

</div>

        <article
  className="
    prose
    prose-invert
    prose-lg
    max-w-none

    prose-headings:text-white
    prose-p:text-neutral-300
    prose-strong:text-white
    prose-li:text-neutral-300
    prose-code:text-primary-400

    prose-img:mx-auto
    prose-img:block
    prose-img:rounded-xl
    prose-img:shadow-2xl
    prose-img:max-w-full
  "
  dangerouslySetInnerHTML={{
    __html: post.contentMarkdown,
  }}
/>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 text-green-400 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default EnhancedBlog;  
export { EnhancedBlog };