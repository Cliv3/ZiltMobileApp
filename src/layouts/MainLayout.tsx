import { Outlet } from 'react-router-dom';
import StatusBar from '../components/common/StatusBar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar />
      
      <main className="flex-1 container max-w-md mx-auto pb-20">
        <Outlet />
      </main>
    </div>
  );
}