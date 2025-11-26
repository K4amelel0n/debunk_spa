# Debunk SPA

Aplikacja Single Page Application zbudowana z użyciem React, TypeScript, Vite, React Router i DaisyUI.

## 🚀 Jak rozpocząć projekt

### Wymagania

- Node.js (wersja 18 lub wyższa)
- npm lub yarn

### Instalacja

1. Sklonuj repozytorium:

```bash
git clone <repository-url>
cd debunk-spa
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Uruchom serwer deweloperski:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`

### Dostępne komendy

- `npm run dev` - Uruchamia serwer deweloperski
- `npm run build` - Buduje aplikację produkcyjną
- `npm run preview` - Podgląd zbudowanej aplikacji
- `npm run lint` - Sprawdza kod pod kątem błędów

## 🎨 Stylowanie z DaisyUI

Projekt wykorzystuje **DaisyUI 5.5.5** - bibliotekę komponentów dla Tailwind CSS 4.x.

### Zasady stylowania

#### 1. Używaj klas komponentów DaisyUI

DaisyUI dostarcza gotowe klasy dla popularnych komponentów UI. **Zawsze używaj ich zamiast tworzyć własne style od zera.**

```tsx
// ✅ DOBRZE - używaj klas DaisyUI
<button className="btn btn-primary">Kliknij mnie</button>

// ❌ ŹLE - nie twórz własnych stylów dla standardowych komponentów
<button className="px-4 py-2 bg-blue-500 rounded">Kliknij mnie</button>
```

#### 2. Komponenty DaisyUI

Najczęściej używane komponenty:

**Przyciski:**

```tsx
<button className="btn">Normalny</button>
<button className="btn btn-primary">Główny</button>
<button className="btn btn-secondary">Drugorzędny</button>
<button className="btn btn-accent">Akcent</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-link">Link</button>

// Rozmiary
<button className="btn btn-lg">Duży</button>
<button className="btn btn-md">Średni</button>
<button className="btn btn-sm">Mały</button>
<button className="btn btn-xs">Bardzo mały</button>

// Stany
<button className="btn btn-disabled">Wyłączony</button>
<button className="btn loading">Ładowanie</button>
```

**Karty:**

```tsx
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Tytuł karty</h2>
    <p>Treść karty</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Akcja</button>
    </div>
  </div>
</div>
```

**Formularze:**

```tsx
<input type="text" className="input input-bordered" placeholder="Wpisz tekst" />
<input type="text" className="input input-primary" />
<textarea className="textarea textarea-bordered"></textarea>
<select className="select select-bordered">
  <option>Opcja 1</option>
  <option>Opcja 2</option>
</select>
```

**Alerty:**

```tsx
<div className="alert alert-info">
  <span>Informacja</span>
</div>
<div className="alert alert-success">
  <span>Sukces</span>
</div>
<div className="alert alert-warning">
  <span>Ostrzeżenie</span>
</div>
<div className="alert alert-error">
  <span>Błąd</span>
</div>
```

**Modal:**

```tsx
<dialog className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Tytuł modala</h3>
    <p className="py-4">Treść modala</p>
    <div className="modal-action">
      <button className="btn">Zamknij</button>
    </div>
  </div>
</dialog>
```

**Navbar:**

```tsx
<div className="navbar bg-base-100">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li>
        <a>Link</a>
      </li>
      <li>
        <a>Link</a>
      </li>
    </ul>
  </div>
</div>
```

**Drawer:**

```tsx
<div className="drawer">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
      Otwórz menu
    </label>
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer" className="drawer-overlay"></label>
    <ul className="menu p-4 w-80 min-h-full bg-base-200">
      <li>
        <a>Menu 1</a>
      </li>
      <li>
        <a>Menu 2</a>
      </li>
    </ul>
  </div>
</div>
```

**Badge:**

```tsx
<div className="badge">Neutralny</div>
<div className="badge badge-primary">Główny</div>
<div className="badge badge-secondary">Drugorzędny</div>
<div className="badge badge-accent">Akcent</div>
<div className="badge badge-ghost">Ghost</div>
```

**Loading:**

```tsx
<span className="loading loading-spinner loading-xs"></span>
<span className="loading loading-spinner loading-sm"></span>
<span className="loading loading-spinner loading-md"></span>
<span className="loading loading-spinner loading-lg"></span>
```

#### 3. System motywów

Projekt wykorzystuje system motywów DaisyUI z dwoma wariantami:

- `light` - motyw jasny (domyślny)
- `dark` - motyw ciemny (używany przy preferencji użytkownika)

Motywy są skonfigurowane w `src/index.css`:

```css
@import 'tailwindcss';
@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark;
}
```

Zmiana motywu odbywa się przez atrybut `data-theme` na elemencie `<html>`:

```tsx
document.documentElement.setAttribute('data-theme', 'dark');
```

#### 4. Kolory semantyczne

DaisyUI używa semantycznych zmiennych kolorów, które automatycznie dostosowują się do motywu:

- `primary` - kolor główny aplikacji
- `secondary` - kolor drugorzędny
- `accent` - kolor akcentu
- `neutral` - kolor neutralny
- `base-100`, `base-200`, `base-300` - kolory tła
- `info`, `success`, `warning`, `error` - kolory stanów

```tsx
// ✅ DOBRZE - używaj semantycznych klas
<div className="bg-base-100 text-base-content">
  <h1 className="text-primary">Tytuł</h1>
  <p className="text-secondary">Treść</p>
</div>

// ❌ ŹLE - unikaj hardcoded kolorów
<div className="bg-white text-black">
  <h1 className="text-blue-600">Tytuł</h1>
</div>
```

#### 5. Responsywność

Łącz klasy DaisyUI z klasami responsywnymi Tailwind:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="card bg-base-100 shadow-xl">...</div>
  <div className="card bg-base-100 shadow-xl">...</div>
  <div className="card bg-base-100 shadow-xl">...</div>
</div>
```

#### 6. Utility classes Tailwind

Możesz łączyć komponenty DaisyUI z utility classes Tailwind dla dodatkowych stylów:

```tsx
<button className="btn btn-primary mt-4 w-full shadow-lg hover:shadow-xl">
  Przycisk
</button>
```

### Dobre praktyki

1. **Zawsze używaj komponentów DaisyUI** dla standardowych elementów UI (przyciski, formularze, karty, etc.)
2. **Używaj semantycznych kolorów** zamiast konkretnych wartości hex/rgb
3. **Testuj w obu motywach** (jasnym i ciemnym)
4. **Łącz z Tailwind** - DaisyUI i Tailwind działają razem
5. **Zachowaj spójność** - używaj tych samych wariantów komponentów w całej aplikacji
6. **Nie nadpisuj stylów DaisyUI** - jeśli potrzebujesz customizacji, użyj klas Tailwind lub rozważ zmianę tematu

### Dokumentacja

- [DaisyUI Components](https://daisyui.com/components/)
- [DaisyUI Themes](https://daisyui.com/docs/themes/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📁 Struktura projektu

```
src/
├── api/          # API calls i integracje
├── components/   # Komponenty wielokrotnego użytku
├── hooks/        # Custom React hooks
├── layouts/      # Layout components (RootLayout, MainLayout, AuthLayout)
├── pages/        # Komponenty stron
├── router/       # Konfiguracja React Router
├── styles/       # Globalne style
└── utils/        # Funkcje pomocnicze
```

### Aliasy importów

Projekt wykorzystuje aliasy dla wygodniejszych importów:

```tsx
import Component from '@components/Component';
import Layout from '@layouts/Layout';
import api from '@api/service';
import { useHook } from '@hooks/useHook';
```

Dostępne aliasy:

- `@layouts` → `/src/layouts`
- `@components` → `/src/components`
- `@api` → `/src/api`
- `@router` → `/src/router`
- `@utils` → `/src/utils`
- `@hooks` → `/src/hooks`
- `@styles` → `/src/styles`
- `@pages` → `/src/pages`

## 🛠 Stack technologiczny

- **React 19.2** - Biblioteka UI
- **TypeScript 5.9** - Typowanie statyczne
- **Vite 7.2** - Build tool i dev server
- **React Router 7.9** - Routing
- **Tailwind CSS 4.1** - Framework CSS
- **DaisyUI 5.5** - Komponenty UI
- **ESLint** - Linting
- **Prettier** - Formatowanie kodu

## 📝 Konwencje nazewnictwa

- Komponenty React: `PascalCase` (np. `UserProfile.tsx`)
- Hooks: `camelCase` z prefiksem `use` (np. `useAuth.ts`)
- Utilities: `camelCase` (np. `formatDate.ts`)
- Typy/Interfejsy: `PascalCase` (np. `User`, `ApiResponse`)
- Stałe: `UPPER_SNAKE_CASE` (np. `API_URL`)

## 🔒 Licencja

MIT
