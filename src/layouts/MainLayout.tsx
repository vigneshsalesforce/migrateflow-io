import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <aside className="hidden md:block w-64 border-r bg-background overflow-y-auto">
          <Sidebar />
        </aside>
        <main className="flex-1 bg-slate-50 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;