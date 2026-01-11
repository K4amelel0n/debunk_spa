import { useState, useEffect } from 'react';
import { useParams, useNavigate, useRouteLoaderData } from 'react-router';
import type { Post } from '@api/posts';
import type { User } from '@api/auth';
import { KATEGORIE } from '@api/posts';
import { getPostById, updatePost } from '@store/mockStore';
import { toast } from 'react-toastify';

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useRouteLoaderData('root') as { user: User | null };

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [tytul, setTytul] = useState('');
  const [trescFakeNewsa, setTrescFakeNewsa] = useState('');
  const [wyjasnienie, setWyjasnienie] = useState('');
  const [kategoriaId, setKategoriaId] = useState<string>('');
  const [zrodla, setZrodla] = useState<string[]>(['']);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!id) return;

    const foundPost = getPostById(parseInt(id));
    if (foundPost) {
      setPost(foundPost);
      setTytul(foundPost.tytul);
      setTrescFakeNewsa(foundPost.trescFakeNewsa);
      setWyjasnienie(foundPost.wyjasnienie);
      setKategoriaId(foundPost.kategoria?.id?.toString() || '');
      setZrodla(
        foundPost.zrodla.length > 0 ? foundPost.zrodla.map((z) => z.url) : ['']
      );
      setImageUrl(foundPost.imageUrl || '');
    }
    setLoading(false);
  }, [id]);

  const canEdit =
    user &&
    post &&
    (user.id === post.autor.id || user.email === post.autor.email);

  const handleDodajZrodlo = () => {
    setZrodla([...zrodla, '']);
  };

  const handleUsunZrodlo = (index: number) => {
    setZrodla(zrodla.filter((_, i) => i !== index));
  };

  const handleZmienZrodlo = (index: number, value: string) => {
    const noweZrodla = [...zrodla];
    noweZrodla[index] = value;
    setZrodla(noweZrodla);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!post || !canEdit) return;

    setSubmitting(true);

    try {
      const updated = updatePost({
        id: post.id,
        tytul,
        trescFakeNewsa,
        wyjasnienie,
        zrodla,
        kategoriaId: kategoriaId ? parseInt(kategoriaId) : undefined,
        imageUrl: imageUrl || undefined,
      });

      if (updated) {
        toast.success('Post został zaktualizowany!');
        navigate(`/posts/${post.id}`);
      } else {
        toast.error('Nie udało się zaktualizować posta.');
      }
    } catch (error) {
      toast.error('Wystąpił błąd podczas aktualizacji.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="alert alert-error max-w-xl mx-auto">
        <span>❌ Nie znaleziono posta.</span>
        <button className="btn btn-sm" onClick={() => navigate('/')}>
          Wróć do strony głównej
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning max-w-xl mx-auto">
        <span>🔒 Musisz być zalogowany, aby edytować posty.</span>
        <button className="btn btn-sm" onClick={() => navigate('/login')}>
          Zaloguj się
        </button>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="alert alert-error max-w-xl mx-auto">
        <span>🚫 Nie masz uprawnień do edycji tego posta.</span>
        <button className="btn btn-sm" onClick={() => navigate(-1)}>
          Wróć
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-8">
      <section className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title justify-center text-2xl">✏️ Edytuj post</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <fieldset className="fieldset" disabled={submitting}>
              <label className="label font-semibold">📝 Tytuł analizy</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={tytul}
                onChange={(e) => setTytul(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset" disabled={submitting}>
              <label className="label font-semibold">🏷️ Kategoria</label>
              <select
                className="select select-bordered w-full"
                value={kategoriaId}
                onChange={(e) => setKategoriaId(e.target.value)}
              >
                <option value="">Wybierz kategorię...</option>
                {KATEGORIE.map((kategoria) => (
                  <option key={kategoria.id} value={kategoria.id}>
                    {kategoria.nazwa}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset" disabled={submitting}>
              <label className="label font-semibold">📷 URL obrazka</label>
              <input
                type="url"
                className="input input-bordered w-full"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Podgląd"
                  className="mt-2 max-h-48 rounded-lg"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
            </fieldset>

            <fieldset className="fieldset" disabled={submitting}>
              <label className="label font-semibold">❌ Treść fake newsa</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={3}
                value={trescFakeNewsa}
                onChange={(e) => setTrescFakeNewsa(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset" disabled={submitting}>
              <label className="label font-semibold">✅ Wyjaśnienie</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={5}
                value={wyjasnienie}
                onChange={(e) => setWyjasnienie(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset" disabled={submitting}>
              <label className="label font-semibold">📚 Źródła</label>
              <div className="flex flex-col gap-2">
                {zrodla.map((zrodlo, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      className="input input-bordered flex-1"
                      placeholder="https://..."
                      value={zrodlo}
                      onChange={(e) => handleZmienZrodlo(index, e.target.value)}
                    />
                    {zrodla.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-error btn-outline"
                        onClick={() => handleUsunZrodlo(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline btn-sm w-fit"
                  onClick={handleDodajZrodlo}
                >
                  ➕ Dodaj kolejne źródło
                </button>
              </div>
            </fieldset>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={submitting}
              >
                {submitting ? 'Zapisywanie...' : '💾 Zapisz zmiany'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditPostPage;
