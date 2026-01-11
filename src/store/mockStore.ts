import type { Post, Comment, Category } from '@api/posts';
import type { User } from '@api/auth';
import { PostStatus, KATEGORIE } from '@api/posts';

const POSTS_STORAGE_KEY = 'debunk_posts';
const USERS_STORAGE_KEY = 'debunk_users';
const RECENTLY_VIEWED_KEY = 'debunk_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

const initialUsers: User[] = [
  { id: 1, email: 'redaktor@debunk.pl', name: 'Jan Kowalski' },
  { id: 2, email: 'jan@example.com', name: 'Anna Nowak' },
  { id: 3, email: 'ekspert@debunk.pl', name: 'Maria Wiśniewska' },
  { id: 4, email: 'ekspert.graficzny@example.com', name: 'Piotr Grafik' },
  { id: 5, email: 'tech@debunk.pl', name: 'Tomasz Techniczny' },
  { id: 6, email: 'prawo@debunk.pl', name: 'Katarzyna Prawnik' },
  { id: 7, email: 'tomek@example.com', name: 'Tomek' },
];

const initialPosts: Post[] = [
  {
    id: 1,
    tytul: 'Fałszywy cytat prezydenta USA na Twitterze',
    trescFakeNewsa:
      'W mediach społecznościowych rozpowszechniany jest screenshot z Twittera, który rzekomo pokazuje kontrowersyjną wypowiedź prezydenta USA o planach wprowadzenia nowych podatków.',
    wyjasnienie:
      'Po dokładnym sprawdzeniu oficjalnego konta prezydenta na platformie X (dawniej Twitter) okazuje się, że taki tweet nigdy nie został opublikowany. Screenshot został stworzony przy użyciu narzędzi do edycji graficznej. Analiza metadanych obrazka wskazuje na manipulację.',
    zrodla: [
      {
        id: 1,
        url: 'https://twitter.com/POTUS',
        title: 'Oficjalne konto prezydenta',
      },
      {
        id: 2,
        url: 'https://factcheck.org/2026/01/fake-tweet',
        title: 'Analiza FactCheck.org',
      },
    ],
    kategoria: { id: 2, nazwa: 'Polityka', opis: 'Dezinformacja polityczna' },
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: '2026-01-08T10:00:00Z',
    autor: { id: 1, email: 'redaktor@debunk.pl', name: 'Jan Kowalski' },
    imageUrl: 'https://picsum.photos/seed/fake1/800/600',
    ocenyPozytywne: 47,
    ocenyNegatywne: 3,
    mojaOcena: null,
    komentarze: [
      {
        id: 1,
        tresc:
          'Sprawdziłem, faktycznie nie ma takiego tweeta. Dzięki za weryfikację!',
        user: { id: 2, email: 'jan@example.com', name: 'Anna Nowak' },
        data: '2026-01-09T14:30:00Z',
      },
    ],
  },
  {
    id: 2,
    tytul: 'Zmanipulowane zdjęcie polityka',
    trescFakeNewsa:
      'W mediach społecznościowych krąży zdjęcie znanego polityka w kompromitującej sytuacji podczas oficjalnego spotkania.',
    wyjasnienie:
      'Analiza metadanych zdjęcia oraz porównanie z oryginalnymi fotografiami z tego wydarzenia wykazuje, że zdjęcie zostało zmodyfikowane w programie graficznym. Widoczne są ślady edycji na krawędziach postaci.',
    zrodla: [
      {
        id: 3,
        url: 'https://reuters.com/fact-check/manipulated-photo',
        title: 'Reuters Fact Check',
      },
    ],
    kategoria: { id: 2, nazwa: 'Polityka', opis: 'Dezinformacja polityczna' },
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: '2026-01-06T16:20:00Z',
    autor: { id: 3, email: 'ekspert@debunk.pl', name: 'Maria Wiśniewska' },
    imageUrl: 'https://picsum.photos/seed/fake2/800/600',
    ocenyPozytywne: 89,
    ocenyNegatywne: 5,
    mojaOcena: true,
    komentarze: [
      {
        id: 2,
        tresc: 'Widać wyraźne ślady edycji na krawędziach. Dobra robota!',
        user: {
          id: 4,
          email: 'ekspert.graficzny@example.com',
          name: 'Piotr Grafik',
        },
        data: '2026-01-07T09:15:00Z',
      },
    ],
  },
  {
    id: 3,
    tytul: 'Fake news o szkodliwości sieci 5G',
    trescFakeNewsa:
      'Artykuł twierdzi, że technologia 5G powoduje poważne problemy zdrowotne i jest powiązana z rozprzestrzenianiem się chorób.',
    wyjasnienie:
      'Nie istnieją żadne wiarygodne badania naukowe potwierdzające szkodliwość technologii 5G dla zdrowia ludzi. WHO oraz liczne instytucje naukowe potwierdzają bezpieczeństwo tej technologii. Częstotliwości używane przez 5G są znacznie poniżej poziomów uznawanych za szkodliwe.',
    zrodla: [
      { id: 4, url: 'https://who.int/5g-safety', title: 'Stanowisko WHO' },
      { id: 5, url: 'https://nature.com/5g-research', title: 'Badania Nature' },
    ],
    kategoria: {
      id: 3,
      nazwa: 'Technologia',
      opis: 'Fałszywe informacje o technologii',
    },
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: '2026-01-05T11:30:00Z',
    autor: { id: 5, email: 'tech@debunk.pl', name: 'Tomasz Techniczny' },
    imageUrl: 'https://picsum.photos/seed/fake3/800/600',
    ocenyPozytywne: 156,
    ocenyNegatywne: 12,
    mojaOcena: null,
    komentarze: [],
  },
  {
    id: 4,
    tytul: 'Fałszywa informacja o nowym podatku',
    trescFakeNewsa:
      'Post na Facebooku twierdzi, że od przyszłego miesiąca wchodzi w życie nowe prawo drastycznie zwiększające podatki od nieruchomości.',
    wyjasnienie:
      'Sprawdzenie w Dzienniku Ustaw pokazuje, że taka ustawa nie istnieje. Ministerstwo Finansów oficjalnie zdementowało te informacje. Jest to przykład dezinformacji mającej na celu wywołanie paniki.',
    zrodla: [
      {
        id: 6,
        url: 'https://dziennikustaw.gov.pl',
        title: 'Dziennik Ustaw RP',
      },
      {
        id: 7,
        url: 'https://gov.pl/finanse/komunikat',
        title: 'Komunikat Ministerstwa',
      },
    ],
    kategoria: {
      id: 5,
      nazwa: 'Gospodarka',
      opis: 'Dezinformacja ekonomiczna',
    },
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: '2026-01-03T14:45:00Z',
    autor: { id: 6, email: 'prawo@debunk.pl', name: 'Katarzyna Prawnik' },
    imageUrl: undefined,
    ocenyPozytywne: 34,
    ocenyNegatywne: 2,
    mojaOcena: null,
    komentarze: [
      {
        id: 3,
        tresc: 'Moja babcia prawie w to uwierzyła, dobrze że sprawdziliście!',
        user: { id: 7, email: 'tomek@example.com', name: 'Tomek' },
        data: '2026-01-04T18:00:00Z',
      },
    ],
  },
  {
    id: 5,
    tytul: 'Fałszywe informacje o szczepionkach',
    trescFakeNewsa:
      'Wiadomość krążąca w komunikatorach twierdzi, że szczepionki zawierają mikrochipy do śledzenia obywateli.',
    wyjasnienie:
      'Szczepionki nie zawierają mikrochipów. Technologia wymagana do stworzenia takiego urządzenia jest zbyt duża, by zmieścić się w igle strzykawki. Skład szczepionek jest publicznie dostępny i regularnie weryfikowany przez niezależne laboratoria.',
    zrodla: [
      { id: 8, url: 'https://who.int/vaccines', title: 'WHO - Szczepionki' },
      {
        id: 9,
        url: 'https://pzh.gov.pl/szczepienia',
        title: 'PZH - Szczepienia',
      },
    ],
    kategoria: {
      id: 1,
      nazwa: 'Zdrowie',
      opis: 'Fake newsy dotyczące zdrowia i medycyny',
    },
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: '2026-01-02T09:00:00Z',
    autor: { id: 1, email: 'redaktor@debunk.pl', name: 'Jan Kowalski' },
    imageUrl: 'https://picsum.photos/seed/fake5/800/600',
    ocenyPozytywne: 234,
    ocenyNegatywne: 18,
    mojaOcena: null,
    komentarze: [
      {
        id: 4,
        tresc: 'Dziękuję za rzetelne wyjaśnienie!',
        user: { id: 2, email: 'jan@example.com', name: 'Anna Nowak' },
        data: '2026-01-02T12:00:00Z',
      },
      {
        id: 5,
        tresc: 'Świetna analiza, podzielę się z rodziną.',
        user: { id: 7, email: 'tomek@example.com', name: 'Tomek' },
        data: '2026-01-02T15:30:00Z',
      },
    ],
  },
  {
    id: 6,
    tytul: 'Fałszywa strona bankowa',
    trescFakeNewsa:
      'E-mail podszywający się pod bank informuje o konieczności weryfikacji konta poprzez kliknięcie w link.',
    wyjasnienie:
      'Jest to klasyczny przykład phishingu. Link prowadzi do fałszywej strony imitującej bank. Prawdziwe banki nigdy nie proszą o podanie danych logowania przez e-mail. Strona ma nieprawidłowy certyfikat SSL.',
    zrodla: [{ id: 10, url: 'https://cert.pl/phishing', title: 'CERT Polska' }],
    kategoria: {
      id: 3,
      nazwa: 'Technologia',
      opis: 'Fałszywe informacje o technologii',
    },
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: '2026-01-01T08:00:00Z',
    autor: { id: 5, email: 'tech@debunk.pl', name: 'Tomasz Techniczny' },
    imageUrl: 'https://picsum.photos/seed/fake6/800/600',
    ocenyPozytywne: 67,
    ocenyNegatywne: 1,
    mojaOcena: null,
    komentarze: [],
  },
];

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
  }
};

const initializeData = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    saveToStorage(USERS_STORAGE_KEY, initialUsers);
  }
  if (!localStorage.getItem(POSTS_STORAGE_KEY)) {
    saveToStorage(POSTS_STORAGE_KEY, initialPosts);
  }
};

initializeData();

export const getUsers = (): User[] => {
  return loadFromStorage<User[]>(USERS_STORAGE_KEY, initialUsers);
};

export const getUserById = (id: number): User | undefined => {
  return getUsers().find((u) => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find((u) => u.email === email);
};

export const addUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser: User = { ...user, id: newId };
  saveToStorage(USERS_STORAGE_KEY, [...users, newUser]);
  return newUser;
};

export const getAllPosts = (): Post[] => {
  return loadFromStorage<Post[]>(POSTS_STORAGE_KEY, initialPosts);
};

export const getPostById = (id: number): Post | undefined => {
  return getAllPosts().find((p) => p.id === id);
};

export const getPostsByUserId = (userId: number): Post[] => {
  return getAllPosts().filter((p) => p.autor.id === userId);
};

export const getPostsByCategory = (categoryId: number): Post[] => {
  return getAllPosts().filter((p) => p.kategoria?.id === categoryId);
};

export interface CreatePostInput {
  tytul: string;
  trescFakeNewsa: string;
  wyjasnienie: string;
  zrodla: string[];
  kategoriaId?: number;
  imageUrl?: string;
  autor: User;
}

export const addPost = (input: CreatePostInput): Post => {
  const posts = getAllPosts();
  const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

  const kategoria = input.kategoriaId
    ? KATEGORIE.find((k) => k.id === input.kategoriaId)
    : undefined;

  const zrodla = input.zrodla
    .filter((url) => url.trim() !== '')
    .map((url, index) => {
      try {
        return {
          id: newId * 100 + index,
          url: url.trim(),
          title: new URL(url.trim()).hostname,
        };
      } catch {
        return {
          id: newId * 100 + index,
          url: url.trim(),
          title: url.trim(),
        };
      }
    });

  const newPost: Post = {
    id: newId,
    tytul: input.tytul,
    trescFakeNewsa: input.trescFakeNewsa,
    wyjasnienie: input.wyjasnienie,
    zrodla,
    kategoria,
    status: PostStatus.OPUBLIKOWANY,
    dataUtworzenia: new Date().toISOString(),
    autor: input.autor,
    imageUrl: input.imageUrl,
    ocenyPozytywne: 0,
    ocenyNegatywne: 0,
    mojaOcena: null,
    komentarze: [],
  };

  saveToStorage(POSTS_STORAGE_KEY, [newPost, ...posts]);
  return newPost;
};

export interface UpdatePostInput {
  id: number;
  tytul: string;
  trescFakeNewsa: string;
  wyjasnienie: string;
  zrodla: string[];
  kategoriaId?: number;
  imageUrl?: string;
}

export const updatePost = (input: UpdatePostInput): Post | null => {
  const posts = getAllPosts();
  const postIndex = posts.findIndex((p) => p.id === input.id);

  if (postIndex === -1) return null;

  const existingPost = posts[postIndex];

  const kategoria = input.kategoriaId
    ? KATEGORIE.find((k) => k.id === input.kategoriaId)
    : existingPost.kategoria;

  const zrodla = input.zrodla
    .filter((url) => url.trim() !== '')
    .map((url, index) => {
      try {
        return {
          id: input.id * 100 + index,
          url: url.trim(),
          title: new URL(url.trim()).hostname,
        };
      } catch {
        return {
          id: input.id * 100 + index,
          url: url.trim(),
          title: url.trim(),
        };
      }
    });

  const updatedPost: Post = {
    ...existingPost,
    tytul: input.tytul,
    trescFakeNewsa: input.trescFakeNewsa,
    wyjasnienie: input.wyjasnienie,
    zrodla,
    kategoria,
    imageUrl: input.imageUrl || existingPost.imageUrl,
  };

  posts[postIndex] = updatedPost;
  saveToStorage(POSTS_STORAGE_KEY, posts);
  return updatedPost;
};

export const deletePost = (id: number): boolean => {
  const posts = getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);

  if (filtered.length === posts.length) return false;

  saveToStorage(POSTS_STORAGE_KEY, filtered);
  return true;
};

export const updatePostRating = (
  postId: number,
  isPositive: boolean,
  previousRating: boolean | null
): void => {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  if (previousRating === true) {
    post.ocenyPozytywne--;
  } else if (previousRating === false) {
    post.ocenyNegatywne--;
  }

  if (isPositive) {
    post.ocenyPozytywne++;
  } else {
    post.ocenyNegatywne++;
  }

  post.mojaOcena = isPositive;
  saveToStorage(POSTS_STORAGE_KEY, posts);
};

export const removePostRating = (
  postId: number,
  wasPositive: boolean
): void => {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  if (wasPositive) {
    post.ocenyPozytywne--;
  } else {
    post.ocenyNegatywne--;
  }

  post.mojaOcena = null;
  saveToStorage(POSTS_STORAGE_KEY, posts);
};

export const addComment = (
  postId: number,
  tresc: string,
  user: User
): Comment => {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error('Post not found');

  const allComments = posts.flatMap((p) => p.komentarze);
  const newCommentId =
    allComments.length > 0 ? Math.max(...allComments.map((c) => c.id)) + 1 : 1;

  const newComment: Comment = {
    id: newCommentId,
    tresc,
    user,
    data: new Date().toISOString(),
  };

  post.komentarze.push(newComment);
  saveToStorage(POSTS_STORAGE_KEY, posts);
  return newComment;
};

export const getRecentlyViewed = (): number[] => {
  return loadFromStorage<number[]>(RECENTLY_VIEWED_KEY, []);
};

export const addToRecentlyViewed = (postId: number): void => {
  const current = getRecentlyViewed();
  const filtered = current.filter((id) => id !== postId);
  const updated = [postId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
  saveToStorage(RECENTLY_VIEWED_KEY, updated);
};

export const getRecentlyViewedPosts = (): Post[] => {
  const ids = getRecentlyViewed();
  const posts = getAllPosts();
  return ids
    .map((id) => posts.find((p) => p.id === id))
    .filter(Boolean) as Post[];
};

export type SortOption = 'newest' | 'oldest' | 'most-liked' | 'most-commented';

export const sortPosts = (posts: Post[], sortBy: SortOption): Post[] => {
  const sorted = [...posts];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.dataUtworzenia).getTime() -
          new Date(a.dataUtworzenia).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.dataUtworzenia).getTime() -
          new Date(b.dataUtworzenia).getTime()
      );
    case 'most-liked':
      return sorted.sort((a, b) => b.ocenyPozytywne - a.ocenyPozytywne);
    case 'most-commented':
      return sorted.sort((a, b) => b.komentarze.length - a.komentarze.length);
    default:
      return sorted;
  }
};

export const filterPostsByCategory = (
  posts: Post[],
  categoryId: number | null
): Post[] => {
  if (categoryId === null) return posts;
  return posts.filter((p) => p.kategoria?.id === categoryId);
};

export const getAllCategories = (): Category[] => {
  return KATEGORIE;
};

export const resetToInitialData = (): void => {
  saveToStorage(USERS_STORAGE_KEY, initialUsers);
  saveToStorage(POSTS_STORAGE_KEY, initialPosts);
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
};
