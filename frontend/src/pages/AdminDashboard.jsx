import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardTab from '../components/admin/DashboardTab';
import BlogsTab from '../components/admin/BlogsTab';
import GalleriesTab from '../components/admin/GalleriesTab';
import PackagesTab from '../components/admin/PackagesTab';
import ExportModal from '../components/admin/ExportModal';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard | Westtamp Wellness";
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-primary-container text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          <span className="font-headline-sm font-bold text-lg">Westtamp Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
          aria-label={sidebarOpen ? "Tutup menu sidebar" : "Buka menu sidebar"}
        >
          <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
        </button>
      </header>

      {/* SideNavBar Component */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} 
        user={user} 
        logout={logout} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-8 lg:p-12 w-full max-w-[1600px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'blogs' && <BlogsTab />}
        {activeTab === 'galleries' && <GalleriesTab />}
        {activeTab === 'packages' && <PackagesTab />}
      </main>

      {/* Financial Report Export Modal */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </div>
  );
}
