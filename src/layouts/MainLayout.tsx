import Header from '@components/Header';
import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <div id="main-layout" className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="grow w-full max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
