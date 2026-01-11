import { useState, useEffect } from 'react';
import { useParams, useNavigate, useRouteLoaderData, Link } from 'react-router';
import type { Post } from '@api/posts';
import type { User } from '@api/auth';
import {
  getPostById,
  addToRecentlyViewed,
  addComment,
  updatePostRating,
  removePostRating,
} from '@store/mockStore';
import AuthRequiredModal from '@components/AuthRequiredModal';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useRouteLoaderData('root') as { user: User | null };

  const [post, setPost] = useState<Post | null>(null);
  const [mojaOcena, setMojaOcena] = useState<boolean | null>(null);
  const [ocenyPozytywne, setOcenyPozytywne] = useState(0);
  const [ocenyNegatywne, setOcenyNegatywne] = useState(0);
  const [nowyKomentarz, setNowyKomentarz] = useState('');
  const [komentarze, setKomentarze] = useState<Post['komentarze']>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  useEffect(() => {
    if (!user) {
      setAuthModalMessage(
        'Musisz się zalogować, aby zobaczyć szczegóły posta.'
      );
      setShowAuthModal(true);
    }
  }, [user]);

  useEffect(() => {
    if (!id || !user) return;

    const postId = parseInt(id);
    const foundPost = getPostById(postId);

    if (foundPost) {
      setPost(foundPost);
      setMojaOcena(foundPost.mojaOcena ?? null);
      setOcenyPozytywne(foundPost.ocenyPozytywne);
      setOcenyNegatywne(foundPost.ocenyNegatywne);
      setKomentarze(foundPost.komentarze);

      addToRecentlyViewed(postId);
    }
  }, [id, user]);

  const requireAuth = (message: string, callback: () => void) => {
    if (!user) {
      setAuthModalMessage(message);
      setShowAuthModal(true);
      return;
    }
    callback();
  };

  const handleOcena = (ocena: boolean) => {
    requireAuth('Musisz się zalogować, aby ocenić ten post.', () => {
      if (!post) return;

      if (mojaOcena === ocena) {
        removePostRating(post.id, ocena);
        setMojaOcena(null);
        if (ocena) setOcenyPozytywne((prev) => prev - 1);
        else setOcenyNegatywne((prev) => prev - 1);
      } else {
        if (mojaOcena === true) setOcenyPozytywne((prev) => prev - 1);
        if (mojaOcena === false) setOcenyNegatywne((prev) => prev - 1);

        updatePostRating(post.id, ocena, mojaOcena);
        setMojaOcena(ocena);

        if (ocena) setOcenyPozytywne((prev) => prev + 1);
        else setOcenyNegatywne((prev) => prev + 1);
      }
    });
  };

  const handleDodajKomentarz = () => {
    requireAuth('Musisz się zalogować, aby dodać komentarz.', () => {
      if (!post || !nowyKomentarz.trim() || !user) return;

      const newComment = addComment(post.id, nowyKomentarz.trim(), user);
      setKomentarze([...komentarze, newComment]);
      setNowyKomentarz('');
    });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="card-title text-2xl">Wymagane logowanie</h2>
            <p className="opacity-70 max-w-md">
              Aby zobaczyć pełną treść artykułu, analizę fake newsa oraz móc
              oceniać i komentować, musisz się zalogować.
            </p>
            <div className="card-actions mt-6">
              <button className="btn btn-ghost" onClick={() => navigate('/')}>
                ← Wróć do strony głównej
              </button>
              <Link to="/login" className="btn btn-primary">
                Zaloguj się
              </Link>
              <Link to="/register" className="btn btn-outline">
                Załóż konto
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="alert alert-error">
        <span>❌ Nie znaleziono posta.</span>
        <button className="btn btn-sm" onClick={() => navigate('/')}>
          Wróć do strony głównej
        </button>
      </div>
    );
  }

  const sformatowanaData = new Date(post.dataUtworzenia).toLocaleDateString(
    'pl-PL',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const getInitial = (name?: string | null, email?: string) => {
    return (name?.[0] || email?.[0] || '?').toUpperCase();
  };

  const canEdit =
    user && (user.id === post.autor.id || user.email === post.autor.email);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
          ← Wróć
        </button>
        {canEdit && (
          <Link
            to={`/posts/${post.id}/edit`}
            className="btn btn-outline btn-sm"
          >
            ✏️ Edytuj
          </Link>
        )}
      </div>

      <article className="card bg-base-100 shadow-lg">
        {post.imageUrl && (
          <figure>
            <img
              src={post.imageUrl}
              alt={post.tytul}
              className="w-full h-80 object-cover"
            />
          </figure>
        )}

        <div className="card-body">
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${post.autor.id}`}
              className="flex items-center gap-3 hover:opacity-80"
            >
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-12">
                  <span>{getInitial(post.autor.name, post.autor.email)}</span>
                </div>
              </div>
              <div>
                <p className="font-medium">
                  {post.autor.name || post.autor.email}
                </p>
                <p className="text-sm opacity-60">{sformatowanaData}</p>
              </div>
            </Link>

            {post.kategoria && (
              <span className="badge badge-outline badge-lg">
                {post.kategoria.nazwa}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mt-4">{post.tytul}</h1>

          <div className="bg-error/10 border-l-4 border-error p-4 rounded-r-lg mt-4">
            <p className="font-semibold text-error mb-2">
              ❌ Fałszywa informacja:
            </p>
            <p>{post.trescFakeNewsa}</p>
          </div>

          <div className="bg-success/10 border-l-4 border-success p-4 rounded-r-lg mt-4">
            <p className="font-semibold text-success mb-2">✅ Wyjaśnienie:</p>
            <p>{post.wyjasnienie}</p>
          </div>

          {post.zrodla.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">📚 Źródła:</h3>
              <ul className="list-disc list-inside space-y-2">
                {post.zrodla.map((zrodlo) => (
                  <li key={zrodlo.id}>
                    <a
                      href={zrodlo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                    >
                      {zrodlo.title || zrodlo.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="divider"></div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Pozytywne oceny</div>
              <div className="stat-value text-success">{ocenyPozytywne}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Negatywne oceny</div>
              <div className="stat-value text-error">{ocenyNegatywne}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Komentarze</div>
              <div className="stat-value">{komentarze.length}</div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleOcena(true)}
              className={`btn btn-lg flex-1 ${mojaOcena === true ? 'btn-success' : 'btn-outline btn-success'}`}
            >
              👍 Potwierdza analizę
            </button>
            <button
              onClick={() => handleOcena(false)}
              className={`btn btn-lg flex-1 ${mojaOcena === false ? 'btn-error' : 'btn-outline btn-error'}`}
            >
              👎 Kwestionuje analizę
            </button>
          </div>

          <div className="divider"></div>
          <h3 className="font-semibold text-lg mb-4">
            💬 Komentarze ({komentarze.length})
          </h3>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Dodaj komentarz..."
              className="input input-bordered flex-1"
              value={nowyKomentarz}
              onChange={(e) => setNowyKomentarz(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDodajKomentarz()}
            />
            <button className="btn btn-primary" onClick={handleDodajKomentarz}>
              Wyślij
            </button>
          </div>

          {komentarze.length === 0 ? (
            <p className="opacity-60">Brak komentarzy. Bądź pierwszy!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {komentarze.map((komentarz) => (
                <div
                  key={komentarz.id}
                  className="flex gap-3 p-3 bg-base-200 rounded-lg"
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                      <span>
                        {getInitial(komentarz.user.name, komentarz.user.email)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {komentarz.user.name || komentarz.user.email}
                      </p>
                      <span className="text-xs opacity-60">
                        {new Date(komentarz.data).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    <p className="mt-1">{komentarz.tresc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authModalMessage}
      />
    </div>
  );
};

export default PostDetailPage;
