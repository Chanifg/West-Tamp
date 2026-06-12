import React from 'react';

export default function AdminSidebar({ activeTab, setActiveTab, user, logout }) {
  return (
    <aside className="bg-primary-container border-r border-primary/20 w-72 fixed left-0 top-0 h-screen hidden lg:flex flex-col z-40">
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

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 mt-auto text-red-300 hover:bg-red-500/20 rounded-lg transition-colors w-full text-left font-bold">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
