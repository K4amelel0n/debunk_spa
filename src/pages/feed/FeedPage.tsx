import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Post } from '@api/posts';
import { KATEGORIE } from '@api/posts';
import PostCardPreview from '@components/PostCardPreview';
import {
  getAllPosts,
  getRecentlyViewedPosts,
  sortPosts,
  filterPostsByCategory,
  type SortOption,
} from '@store/mockStore';

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Post[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPosts = () => {
    let allPosts = getAllPosts();
    allPosts = filterPostsByCategory(allPosts, categoryFilter);
    allPosts = sortPosts(allPosts, sortOption);
    setPosts(allPosts);
  };

  useEffect(() => {
    refreshPosts();
    setRecentlyViewed(getRecentlyViewedPosts());
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshPosts();
  }, [sortOption, categoryFilter]);

  useEffect(() => {
    const handleFocus = () => {
      setRecentlyViewed(getRecentlyViewedPosts());
      refreshPosts();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [sortOption, categoryFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <section className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Posty</h1>
          <div className="flex gap-2 flex-wrap">
            <select
              className="select select-bordered select-sm"
              value={categoryFilter ?? ''}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">Wszystkie kategorie</option>
              {KATEGORIE.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.nazwa}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered select-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
              <option value="most-liked">Najpopularniejsze</option>
              <option value="most-commented">Najczęściej komentowane</option>
            </select>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="alert">
            <span>Brak postów do wyświetlenia.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCardPreview key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <aside className="hidden lg:block w-80">
        <div className="sticky top-20">
          <div className="card bg-base-100 shadow-md max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="card-body">
              <h2 className="card-title text-base">📜 Ostatnio przeglądane</h2>

              {recentlyViewed.length === 0 ? (
                <p className="text-sm opacity-60">
                  Brak historii. Otwórz jakiś artykuł, aby go tu zobaczyć.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentlyViewed.slice(0, 5).map((post) => (
                    <Link
                      key={post.id}
                      to={`/posts/${post.id}`}
                      className="flex gap-3 p-2 rounded-lg hover:bg-base-200"
                    >
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-base-300 flex items-center justify-center">
                          <span>📄</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {post.tytul}
                        </p>
                        <p className="text-xs opacity-60">
                          {post.autor.name || post.autor.email}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default FeedPage;
