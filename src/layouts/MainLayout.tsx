import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <main className="flex-1 container max-w-md mx-auto pb-20">
        <Outlet />
      </main>
    </div>
  );
}