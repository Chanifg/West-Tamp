import React from 'react';

export default function AdminSidebar({ activeTab, setActiveTab, user, logout, sidebarOpen, setSidebarOpen, onOpenExport }) {
  return (
    <>
      <aside className={`bg-primary-container border-r border-primary/20 w-72 fixed left-0 top-0 h-screen flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Westtamp Admin</h2>
              <p className="text-xs text-primary-fixed-dim/80 truncate w-32">{user?.email || 'admin@westtamp.com'}</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-primary-fixed-dim hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
            aria-label="Tutup sidebar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col p-6 gap-y-2 flex-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('blogs')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'blogs' ? 'bg-white/10 text-white' : 'text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">article</span>
            Blog Management
          </button>

          <button 
            onClick={() => setActiveTab('galleries')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'galleries' ? 'bg-white/10 text-white' : 'text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">collections</span>
            Gallery Management
          </button>

          <button 
            onClick={() => setActiveTab('packages')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'packages' ? 'bg-white/10 text-white' : 'text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">inventory_2</span>
            Package Management
          </button>

          <button 
            onClick={() => setActiveTab('statistics')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-bold ${activeTab === 'statistics' ? 'bg-white/10 text-white' : 'text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">monitoring</span>
            Analisis Statistik
          </button>

          <button 
            onClick={onOpenExport} 
            className="flex items-center gap-3 px-4 py-3 text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white rounded-lg transition-colors font-bold w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined">download</span>
            Ekspor Laporan
          </button>

          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 mt-auto text-red-300 hover:bg-red-500/20 rounded-lg transition-colors w-full text-left font-bold">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
