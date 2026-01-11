import { Form, Link, useRouteLoaderData } from 'react-router';
import type { User } from '@api/auth';

const UserMenu = () => {
  const { user } = useRouteLoaderData('root') as { user: User | null };

  const getInitial = (name?: string | null, email?: string) => {
    return (name?.[0] || email?.[0] || '?').toUpperCase();
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="avatar placeholder cursor-pointer"
      >
        <div className="bg-primary text-primary-content w-10 rounded-full">
          <span className="text-sm">
            {user ? getInitial(user.name, user.email) : '?'}
          </span>
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg mt-2"
      >
        {user && (
          <>
            <li className="menu-title px-4 py-2">
              <span className="font-semibold">{user.name || user.email}</span>
            </li>
            <li>
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-2"
              >
                👤 Mój profil
              </Link>
            </li>
            <div className="divider my-1"></div>
          </>
        )}
        <Form method="post" action="/logout">
          <li>
            <button
              type="submit"
              className="text-error hover:bg-error hover:text-error-content w-full"
            >
              🚪 Wyloguj
            </button>
          </li>
        </Form>
      </ul>
    </div>
  );
};
export default UserMenu;
