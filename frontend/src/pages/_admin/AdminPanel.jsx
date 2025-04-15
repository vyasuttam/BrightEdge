// src/components/admin/AdminLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

export default function AdminPanel() {

  const { admin } = useContext(AdminContext);

  const navigate = useNavigate();

  if(!admin) {
    return navigate("/admin-login");
  }

  return (
    <div className="flex h-screen">
    <div className="flex h-screen bg-gray-50 w-full">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
    </div>
  );
}
