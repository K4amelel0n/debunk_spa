# 📚 Dokumentacja API dla Debunk - Platforma weryfikacji fake newsów

Ten dokument zawiera pełną specyfikację API wymaganą przez aplikację frontendową.
Backendowiec powinien zaimplementować wszystkie poniższe endpointy.

**Baza danych:** MongoDB

---

## 📊 Struktura bazy danych (MongoDB)

### Kolekcja: `users`

```javascript
{
  _id: ObjectId,
  email: String,          // unique, required - adres email (login)
  name: String,           // optional - nazwa wyświetlana
  password: String,       // required - zahashowane hasło (bcrypt)
  createdAt: Date         // default: new Date()
}
```

**Indeksy:**

- `{ email: 1 }` - unique

---

### Kolekcja: `categories`

```javascript
{
  _id: ObjectId,
  nazwa: String,          // required - nazwa kategorii
  opis: String            // optional - opis kategorii
}
```

**Predefiniowane kategorie (seed data):**

```javascript
[
  { nazwa: 'Zdrowie', opis: 'Fake newsy dotyczące zdrowia i medycyny' },
  { nazwa: 'Polityka', opis: 'Dezinformacja polityczna' },
  { nazwa: 'Technologia', opis: 'Fałszywe informacje o technologii' },
  { nazwa: 'Środowisko', opis: 'Fake newsy o klimacie i środowisku' },
  { nazwa: 'Gospodarka', opis: 'Dezinformacja ekonomiczna' },
  { nazwa: 'Nauka', opis: 'Fałszywe twierdzenia naukowe' },
];
```

---

### Kolekcja: `posts`

```javascript
{
  _id: ObjectId,
  tytul: String,              // required - tytuł analizy
  trescFakeNewsa: String,     // required - oryginalna treść fałszywej informacji
  wyjasnienie: String,        // required - wyjaśnienie dlaczego to fake news
  zrodla: [                   // embedded array - źródła
    {
      url: String,            // required
      title: String           // optional
    }
  ],
  kategoria: {                // embedded object lub reference
    _id: ObjectId,
    nazwa: String,
    opis: String
  },
  status: Number,             // 0=oczekujący, 1=opublikowany, 2=odrzucony
  dataUtworzenia: Date,       // default: new Date()
  autor: {                    // embedded user info
    _id: ObjectId,
    email: String,
    name: String
  },
  imageUrl: String,           // optional - URL obrazka
  ocenyPozytywne: Number,     // default: 0 - licznik pozytywnych ocen
  ocenyNegatywne: Number,     // default: 0 - licznik negatywnych ocen
  komentarze: [               // embedded array - komentarze
    {
      _id: ObjectId,
      tresc: String,
      user: {
        _id: ObjectId,
        email: String,
        name: String
      },
      data: Date
    }
  ]
}
```

**Indeksy:**

- `{ "autor._id": 1 }` - dla pobierania postów użytkownika
- `{ status: 1, dataUtworzenia: -1 }` - dla sortowania opublikowanych postów
- `{ "kategoria._id": 1 }` - dla filtrowania po kategorii

---

### Kolekcja: `ratings`

```javascript
{
  _id: ObjectId,
  postId: ObjectId,           // reference do posts
  userId: ObjectId,           // reference do users
  typ: Boolean,               // true=pozytywna, false=negatywna
  data: Date                  // default: new Date()
}
```

**Indeksy:**

- `{ postId: 1, userId: 1 }` - unique compound index (użytkownik może ocenić post tylko raz)

---

### Kolekcja: `refreshTokens`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // reference do users
  token: String,              // refresh token
  expiresAt: Date             // data wygaśnięcia
}
```

**Indeksy:**

- `{ token: 1 }` - dla szybkiego wyszukiwania
- `{ expiresAt: 1 }` - TTL index do automatycznego usuwania wygasłych tokenów

---

## 🔐 Endpointy autoryzacji

Base URL: `/api/v1/auth`

### POST `/api/v1/auth/register`

Rejestracja nowego użytkownika.

**Request Body:**

```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Response 201:**

```json
{
  "success": true,
  "message": "Użytkownik zarejestrowany pomyślnie",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "jan@example.com",
      "name": "Jan Kowalski"
    }
  }
}
```

**Response 400 (błąd walidacji):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email jest już zajęty"
  }
}
```

---

### POST `/api/v1/auth/login`

Logowanie użytkownika. Ustawia HTTP-only cookies z access token i refresh token.

**Request Body:**

```json
{
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "jan@example.com",
      "name": "Jan Kowalski"
    }
  }
}
```

**Cookies ustawiane przez serwer:**

- `accessToken` (HTTP-only, Secure, SameSite=Strict) - ważny 15 minut
- `refreshToken` (HTTP-only, Secure, SameSite=Strict) - ważny 7 dni

**Response 401:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Nieprawidłowy email lub hasło"
  }
}
```

---

### GET `/api/v1/auth/me`

Pobiera dane aktualnie zalogowanego użytkownika (na podstawie access token z cookie).

**Headers:** Cookie z accessToken

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "jan@example.com",
      "name": "Jan Kowalski"
    }
  }
}
```

**Response 401:**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Brak autoryzacji"
  }
}
```

---

### POST `/api/v1/auth/refresh-token`

Odświeża access token używając refresh token z cookie.

**Headers:** Cookie z refreshToken

**Response 200:**

```json
{
  "success": true,
  "message": "Token odświeżony"
}
```

---

### POST `/api/v1/auth/logout`

Wylogowuje użytkownika - usuwa tokeny z cookies i bazy.

**Response 200:**

```json
{
  "success": true,
  "message": "Wylogowano pomyślnie"
}
```

---

## 📝 Endpointy postów

Base URL: `/api/v1/posts`

### GET `/api/v1/posts`

Pobiera listę wszystkich opublikowanych postów.

**Query Parameters:**
| Parametr | Typ | Opis |
|----------|-----|------|
| sort | string | `newest`, `oldest`, `most-liked`, `most-commented` |
| category | string | ID kategorii (ObjectId) do filtrowania |
| limit | number | Liczba wyników (domyślnie 20) |
| skip | number | Offset dla paginacji |

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "tytul": "Fałszywy cytat prezydenta USA",
      "trescFakeNewsa": "W mediach społecznościowych...",
      "wyjasnienie": "Po dokładnym sprawdzeniu...",
      "zrodla": [{ "url": "https://...", "title": "Oficjalne źródło" }],
      "kategoria": {
        "id": "507f1f77bcf86cd799439012",
        "nazwa": "Polityka",
        "opis": "..."
      },
      "status": 1,
      "dataUtworzenia": "2026-01-08T10:00:00Z",
      "autor": {
        "id": "507f1f77bcf86cd799439013",
        "email": "redaktor@debunk.pl",
        "name": "Jan Kowalski"
      },
      "imageUrl": "https://...",
      "ocenyPozytywne": 47,
      "ocenyNegatywne": 3,
      "mojaOcena": true,
      "komentarze": [
        {
          "id": "507f1f77bcf86cd799439014",
          "tresc": "Świetna analiza!",
          "user": {
            "id": "507f1f77bcf86cd799439015",
            "email": "...",
            "name": "Anna"
          },
          "data": "2026-01-09T14:30:00Z"
        }
      ]
    }
  ]
}
```

**UWAGA:** Pole `mojaOcena` powinno być:

- `true` jeśli zalogowany użytkownik dał pozytywną ocenę
- `false` jeśli zalogowany użytkownik dał negatywną ocenę
- `null` jeśli użytkownik nie ocenił lub nie jest zalogowany

---

### GET `/api/v1/posts/:id`

Pobiera szczegóły pojedynczego posta.

**Response 200:** Taki sam format jak pojedynczy element z listy powyżej.

**Response 404:**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Post nie został znaleziony"
  }
}
```

---

### POST `/api/v1/posts`

Tworzy nowy post. **Wymaga autoryzacji.**

**Request Body:**

```json
{
  "tytul": "Tytuł analizy",
  "trescFakeNewsa": "Treść fałszywej informacji...",
  "wyjasnienie": "Wyjaśnienie dlaczego to nieprawda...",
  "zrodla": ["https://zrodlo1.com", "https://zrodlo2.com"],
  "kategoriaId": "507f1f77bcf86cd799439012",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "tytul": "Tytuł analizy",
    ...
  }
}
```

---

### PUT `/api/v1/posts/:id`

Aktualizuje istniejący post. **Wymaga autoryzacji. Tylko autor może edytować.**

**Request Body:** Taki sam jak POST

**Response 200:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Response 403:**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Nie masz uprawnień do edycji tego posta"
  }
}
```

---

### DELETE `/api/v1/posts/:id`

Usuwa post. **Wymaga autoryzacji. Tylko autor może usunąć.**

**Response 200:**

```json
{
  "success": true,
  "message": "Post został usunięty"
}
```

---

## 👍 Endpointy ocen (ratings)

### POST `/api/v1/posts/:id/rate`

Dodaje lub zmienia ocenę posta. **Wymaga autoryzacji.**

**Request Body:**

```json
{
  "isPositive": true
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "ocenyPozytywne": 48,
    "ocenyNegatywne": 3,
    "mojaOcena": true
  }
}
```

---

### DELETE `/api/v1/posts/:id/rate`

Usuwa ocenę posta. **Wymaga autoryzacji.**

**Response 200:**

```json
{
  "success": true,
  "data": {
    "ocenyPozytywne": 47,
    "ocenyNegatywne": 3,
    "mojaOcena": null
  }
}
```

---

## 💬 Endpointy komentarzy

### POST `/api/v1/posts/:id/comments`

Dodaje komentarz do posta. **Wymaga autoryzacji.**

**Request Body:**

```json
{
  "tresc": "Treść komentarza"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "tresc": "Treść komentarza",
    "user": { "id": "...", "email": "...", "name": "Jan" },
    "data": "2026-01-11T12:00:00Z"
  }
}
```

---

### DELETE `/api/v1/posts/:postId/comments/:commentId`

Usuwa komentarz. **Wymaga autoryzacji. Tylko autor komentarza może usunąć.**

**Response 200:**

```json
{
  "success": true,
  "message": "Komentarz został usunięty"
}
```

---

## 🏷️ Endpointy kategorii

### GET `/api/v1/categories`

Pobiera listę wszystkich kategorii.

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439018",
      "nazwa": "Zdrowie",
      "opis": "Fake newsy dotyczące zdrowia i medycyny"
    },
    {
      "id": "507f1f77bcf86cd799439019",
      "nazwa": "Polityka",
      "opis": "Dezinformacja polityczna"
    },
    {
      "id": "507f1f77bcf86cd79943901a",
      "nazwa": "Technologia",
      "opis": "Fałszywe informacje o technologii"
    },
    {
      "id": "507f1f77bcf86cd79943901b",
      "nazwa": "Środowisko",
      "opis": "Fake newsy o klimacie i środowisku"
    },
    {
      "id": "507f1f77bcf86cd79943901c",
      "nazwa": "Gospodarka",
      "opis": "Dezinformacja ekonomiczna"
    },
    {
      "id": "507f1f77bcf86cd79943901d",
      "nazwa": "Nauka",
      "opis": "Fałszywe twierdzenia naukowe"
    }
  ]
}
```

---

## 👤 Endpointy użytkowników

### GET `/api/v1/users/:id`

Pobiera profil użytkownika.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "jan@example.com",
    "name": "Jan Kowalski"
  }
}
```

---

### GET `/api/v1/users/:id/posts`

Pobiera posty danego użytkownika.

**Query Parameters:**
| Parametr | Typ | Opis |
|----------|-----|------|
| sort | string | `newest`, `oldest`, `most-liked`, `most-commented` |

**Response 200:**

```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## ⚙️ Konfiguracja CORS

Backend musi obsługiwać CORS dla frontendu:

```javascript
{
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://debunk.example.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

## 🔒 Middleware autoryzacji

Dla endpointów wymagających autoryzacji:

1. Sprawdź cookie `accessToken`
2. Zweryfikuj JWT token
3. Jeśli wygasł - zwróć 401, frontend wywoła `/refresh-token`
4. Dodaj `req.user` z danymi użytkownika

---

## 📋 Kody błędów

| Kod              | HTTP Status | Opis                              |
| ---------------- | ----------- | --------------------------------- |
| VALIDATION_ERROR | 400         | Błąd walidacji danych wejściowych |
| UNAUTHORIZED     | 401         | Brak lub nieprawidłowy token      |
| FORBIDDEN        | 403         | Brak uprawnień do zasobu          |
| NOT_FOUND        | 404         | Zasób nie istnieje                |
| CONFLICT         | 409         | Konflikt (np. email już istnieje) |
| INTERNAL_ERROR   | 500         | Błąd serwera                      |

---

## 🚀 Przykład implementacji z Mongoose

### Schematy Mongoose

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// models/Category.js
const categorySchema = new mongoose.Schema({
  nazwa: { type: String, required: true },
  opis: { type: String },
});

// models/Post.js
const sourceSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    title: { type: String },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema({
  tresc: { type: String, required: true },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    name: String,
  },
  data: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  tytul: { type: String, required: true },
  trescFakeNewsa: { type: String, required: true },
  wyjasnienie: { type: String, required: true },
  zrodla: [sourceSchema],
  kategoria: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    nazwa: String,
    opis: String,
  },
  status: { type: Number, default: 0 },
  dataUtworzenia: { type: Date, default: Date.now },
  autor: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    name: String,
  },
  imageUrl: { type: String },
  ocenyPozytywne: { type: Number, default: 0 },
  ocenyNegatywne: { type: Number, default: 0 },
  komentarze: [commentSchema],
});

postSchema.index({ 'autor._id': 1 });
postSchema.index({ status: 1, dataUtworzenia: -1 });
postSchema.index({ 'kategoria._id': 1 });

// models/Rating.js
const ratingSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  typ: { type: Boolean, required: true },
  data: { type: Date, default: Date.now },
});

ratingSchema.index({ postId: 1, userId: 1 }, { unique: true });

// models/RefreshToken.js
const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## 🧹 MIGRACJA Z MOCK DATA - CO USUNĄĆ/ZMIENIĆ W FRONTENDZIE

Po wdrożeniu backendu, frontend wymaga następujących zmian:

### ❌ PLIKI DO USUNIĘCIA

| Plik                     | Opis                                 |
| ------------------------ | ------------------------------------ |
| `src/store/mockStore.ts` | Cała mock baza danych w localStorage |
| `src/store/index.ts`     | Export mock store                    |
| `src/api/mockData.ts`    | Statyczne dane testowe               |

### ⚠️ PLIKI DO MODYFIKACJI

#### 1. `src/pages/feed/FeedPage.tsx`

**Zamień:**

```typescript
import {
  getAllPosts,
  getRecentlyViewedPosts,
  sortPosts,
  filterPostsByCategory,
} from '@store/mockStore';
```

**Na:**

```typescript
import { getPosts } from '@api/posts';
```

**Zamień funkcje:**

- `getAllPosts()` → `await getPosts({ sort, category })`
- Sortowanie i filtrowanie przenieś na backend (query params)

---

#### 2. `src/pages/posts/PostDetailPage.tsx`

**Zamień:**

```typescript
import {
  getPostById,
  addToRecentlyViewed,
  addComment,
  updatePostRating,
  removePostRating,
} from '@store/mockStore';
```

**Na:**

```typescript
import { getPost, ratePost, removeRating, addComment } from '@api/posts';
```

**Zamień:**

- `getPostById(id)` → `await getPost(id)`
- `updatePostRating(...)` → `await ratePost(id, isPositive)`
- `removePostRating(...)` → `await removeRating(id)`
- `addComment(...)` → `await addComment(id, tresc)`
- `addToRecentlyViewed()` → Można zostawić w localStorage lub usunąć

---

#### 3. `src/pages/posts/addPostAction.tsx`

**Zamień:**

```typescript
import { addPost } from '@store/mockStore';
```

**Na:**

```typescript
import { createPost } from '@api/posts';
```

**Zamień:**

- Całą logikę localStorage user na pobranie z kontekstu/cookies
- `addPost({...})` → `await createPost({...})`

---

#### 4. `src/pages/posts/EditPostPage.tsx`

**Zamień:**

```typescript
import { getPostById, updatePost } from '@store/mockStore';
```

**Na:**

```typescript
import { getPost, updatePost } from '@api/posts';
```

---

#### 5. `src/pages/profile/UserProfilePage.tsx`

**Zamień:**

```typescript
import { getPostsByUserId, getUserById, sortPosts } from '@store/mockStore';
```

**Na:**

```typescript
import { getUser, getUserPosts } from '@api/users';
```

---

#### 6. `src/pages/feed/loader.tsx`

**Zamień całą zawartość:**

```typescript
import { getPosts } from '@api/posts';

const feedLoader = async () => {
  try {
    const posts = await getPosts();
    return { posts };
  } catch (error) {
    return { error: 'Nie udało się pobrać postów' };
  }
};

export default feedLoader;
```

---

#### 7. `src/api/posts.ts`

**Dodaj brakujące funkcje API:**

```typescript
export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`${ROUTE}/${id}`);
  return response.data.data;
};

export const updatePost = async (
  id: string,
  data: CreatePostData
): Promise<Post> => {
  const response = await api.put(`${ROUTE}/${id}`, data);
  return response.data.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`${ROUTE}/${id}`);
};

export const ratePost = async (
  id: string,
  isPositive: boolean
): Promise<RatingResponse> => {
  const response = await api.post(`${ROUTE}/${id}/rate`, { isPositive });
  return response.data.data;
};

export const removeRating = async (id: string): Promise<RatingResponse> => {
  const response = await api.delete(`${ROUTE}/${id}/rate`);
  return response.data.data;
};

export const addComment = async (
  id: string,
  tresc: string
): Promise<Comment> => {
  const response = await api.post(`${ROUTE}/${id}/comments`, { tresc });
  return response.data.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/api/v1/categories');
  return response.data.data;
};
```

---

#### 8. Utwórz `src/api/users.ts`

```typescript
import { api } from '@api';
import type { User } from './auth';
import type { Post } from './posts';

const ROUTE = '/api/v1/users';

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`${ROUTE}/${id}`);
  return response.data.data;
};

export const getUserPosts = async (
  id: string,
  sort?: string
): Promise<Post[]> => {
  const response = await api.get(`${ROUTE}/${id}/posts`, { params: { sort } });
  return response.data.data;
};
```

---

### 🔧 KONFIGURACJA

#### `vite.config.ts` / `tsconfig.app.json`

**Usuń alias:**

```typescript
'@store': path.resolve(__dirname, './src/store'),
'@store/*': path.resolve(__dirname, './src/store/*'),
```

---

### 📦 LOCALSTORAGE KEYS DO USUNIĘCIA (opcjonalnie)

Po migracji można usunąć następujące klucze z localStorage:

- `debunk_posts` - mock posty
- `debunk_users` - mock użytkownicy
- `debunk_recently_viewed` - można zostawić jeśli chcesz zachować historię lokalnie
- `debunk_current_user` - zastąpione przez cookies/session

---

### ✅ CHECKLIST MIGRACJI

- [ ] Backend uruchomiony i dostępny
- [ ] Kategorie załadowane do bazy (seed)
- [ ] CORS skonfigurowany
- [ ] Usunięto `src/store/` folder
- [ ] Usunięto `src/api/mockData.ts`
- [ ] Zaktualizowano `src/pages/feed/FeedPage.tsx`
- [ ] Zaktualizowano `src/pages/feed/loader.tsx`
- [ ] Zaktualizowano `src/pages/posts/PostDetailPage.tsx`
- [ ] Zaktualizowano `src/pages/posts/addPostAction.tsx`
- [ ] Zaktualizowano `src/pages/posts/EditPostPage.tsx`
- [ ] Zaktualizowano `src/pages/profile/UserProfilePage.tsx`
- [ ] Rozszerzono `src/api/posts.ts` o brakujące funkcje
- [ ] Utworzono `src/api/users.ts`
- [ ] Usunięto alias `@store` z konfiguracji
- [ ] Przetestowano autoryzację (login, register, logout)
- [ ] Przetestowano CRUD postów
- [ ] Przetestowano oceny i komentarze
