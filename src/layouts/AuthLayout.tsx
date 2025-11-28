import AppLogo from '@components/AppLogo';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 sm:pt-16 md:pt-24 lg:pt-32">
      <header className="mb-6">
        <AppLogo />
      </header>
      <div className="flex justify-center w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
