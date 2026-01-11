import { useState, useEffect } from 'react';
import { useParams, useNavigate, useRouteLoaderData } from 'react-router';
import type { Post } from '@api/posts';
import type { User } from '@api/auth';
import {
  getPostsByUserId,
  getUserById,
  sortPosts,
  type SortOption,
} from '@store/mockStore';
import PostCardPreview from '@components/PostCardPreview';

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useRouteLoaderData('root') as {
    user: User | null;
  };

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const isOwnProfile = currentUser && id && currentUser.id === parseInt(id);

  useEffect(() => {
    if (!id) return;

    const userId = parseInt(id);
    const foundUser = getUserById(userId);

    if (foundUser) {
      setProfileUser(foundUser);
      const posts = getPostsByUserId(userId);
      setUserPosts(sortPosts(posts, sortOption));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const userId = parseInt(id);
    const posts = getPostsByUserId(userId);
    setUserPosts(sortPosts(posts, sortOption));
  }, [sortOption, id]);

  if (!profileUser) {
    return (
      <div className="alert alert-error">
        <span>❌ Nie znaleziono użytkownika.</span>
        <button className="btn btn-sm" onClick={() => navigate('/')}>
          Wróć do strony głównej
        </button>
      </div>
    );
  }

  const getInitial = (name?: string | null, email?: string) => {
    return (name?.[0] || email?.[0] || '?').toUpperCase();
  };

  const totalLikes = userPosts.reduce((sum, p) => sum + p.ocenyPozytywne, 0);
  const totalDislikes = userPosts.reduce((sum, p) => sum + p.ocenyNegatywne, 0);
  const totalComments = userPosts.reduce(
    (sum, p) => sum + p.komentarze.length,
    0
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm mb-4"
      >
        ← Wróć
      </button>

      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="flex items-center gap-6">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-24">
                <span className="text-3xl">
                  {getInitial(profileUser.name, profileUser.email)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {profileUser.name || 'Użytkownik'}
                {isOwnProfile && (
                  <span className="badge badge-primary ml-2">To Ty</span>
                )}
              </h1>
              <p className="opacity-60">{profileUser.email}</p>
            </div>
          </div>

          <div className="stats shadow mt-6">
            <div className="stat">
              <div className="stat-title">Opublikowane posty</div>
              <div className="stat-value text-primary">{userPosts.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Otrzymane 👍</div>
              <div className="stat-value text-success">{totalLikes}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Otrzymane 👎</div>
              <div className="stat-value text-error">{totalDislikes}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Komentarze pod postami</div>
              <div className="stat-value">{totalComments}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              📝 Posty użytkownika ({userPosts.length})
            </h2>
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

          {userPosts.length === 0 ? (
            <div className="alert">
              <span>
                Ten użytkownik nie opublikował jeszcze żadnych postów.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {userPosts.map((post) => (
                <PostCardPreview key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
