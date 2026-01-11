import { Link } from 'react-router';
import type { Post } from '@api/posts';

interface PostCardPreviewProps {
  post: Post;
}

const PostCardPreview = ({ post }: PostCardPreviewProps) => {
  const sformatowanaData = new Date(post.dataUtworzenia).toLocaleDateString(
    'pl-PL',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const getInitial = (name?: string | null, email?: string) => {
    return (name?.[0] || email?.[0] || '?').toUpperCase();
  };

  const shortDescription =
    post.trescFakeNewsa.length > 150
      ? post.trescFakeNewsa.substring(0, 150) + '...'
      : post.trescFakeNewsa;

  return (
    <Link to={`/posts/${post.id}`} className="block">
      <article className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex">
          {post.imageUrl && (
            <figure className="w-48 shrink-0">
              <img
                src={post.imageUrl}
                alt={post.tytul}
                className="w-full h-full object-cover rounded-l-2xl"
              />
            </figure>
          )}

          <div className="card-body flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8">
                    <span className="text-xs">
                      {getInitial(post.autor.name, post.autor.email)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {post.autor.name || post.autor.email}
                  </p>
                  <p className="text-xs opacity-60">{sformatowanaData}</p>
                </div>
              </div>

              {post.kategoria && (
                <span className="badge badge-outline badge-sm">
                  {post.kategoria.nazwa}
                </span>
              )}
            </div>

            <h2 className="card-title text-lg">{post.tytul}</h2>
            <p className="text-sm opacity-70 line-clamp-2">
              {shortDescription}
            </p>
            <div className="card-actions justify-start mt-2 pt-2 border-t border-base-300">
              <div className="flex gap-4 text-sm opacity-70">
                <span className="flex items-center gap-1">
                  👍 {post.ocenyPozytywne}
                </span>
                <span className="flex items-center gap-1">
                  👎 {post.ocenyNegatywne}
                </span>
                <span className="flex items-center gap-1">
                  💬 {post.komentarze.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCardPreview;
