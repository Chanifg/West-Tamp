import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardTab from '../components/admin/DashboardTab';
import BlogsTab from '../components/admin/BlogsTab';
import GalleriesTab from '../components/admin/GalleriesTab';
import PackagesTab from '../components/admin/PackagesTab';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* SideNavBar Component */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        logout={logout} 
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-8 lg:p-12 w-full max-w-[1600px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'blogs' && <BlogsTab />}
        {activeTab === 'galleries' && <GalleriesTab />}
        {activeTab === 'packages' && <PackagesTab />}
      </main>
    </div>
  );
}
