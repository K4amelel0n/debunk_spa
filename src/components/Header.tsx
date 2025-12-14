import { Link, useLoaderData } from 'react-router';
import UserMenu from './UserMenu';

const Header = () => {
  const data = useLoaderData();
  const isUser = data && data.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-extrabold tracking-tight text-base-content">
            Debunk
          </span>
        </Link>
        {isUser ? (
          <UserMenu />
        ) : (
          <div className="flex gap-4 justify-space-between">
            <nav className="flex items-center gap-4">
              <Link to="/login" className="btn btn-ghost-otline btn-sm">
                Zaloguj się
              </Link>
            </nav>

            <nav className="flex items-center gap-4">
              <Link to="/register" className="btn btn-primary btn-sm">
                Załóż konto
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
