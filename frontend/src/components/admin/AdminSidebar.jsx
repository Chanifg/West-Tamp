import React from 'react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  user,
  logout,
  sidebarOpen,
  setSidebarOpen,
  onOpenExport
}) {

  const menuClass = (tab) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      activeTab === tab
        ? 'bg-white/10 text-white'
        : 'text-primary-fixed-dim/80 hover:bg-white/5 hover:text-white'
    }`;

  const sectionTitle =
    'px-4 pt-4 pb-2 text-[11px] uppercase tracking-wider text-primary-fixed-dim/50 font-semibold';

  return (
    <>
      <aside
        className={`
          bg-primary-container
          border-r border-primary/20
          w-72
          fixed
          left-0
          top-0
          h-screen
          flex
          flex-col
          z-40
          transition-transform
          duration-300
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* Header */}
        <div className="p-6 border-b border-white/10">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">
                  admin_panel_settings
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  WestTamp Admin
                </h2>

                <p className="text-xs text-primary-fixed-dim/80 truncate w-40">
                  {user?.email || 'admin@westtamp.com'}
                </p>
              </div>

            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="
                lg:hidden
                p-2
                rounded-lg
                text-primary-fixed-dim
                hover:bg-white/10
                hover:text-white
                transition-all
              "
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>

          </div>

        </div>

        {/* Menu */}
        <nav className="flex flex-col p-4 flex-1 overflow-y-auto">

          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={menuClass('dashboard')}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: "'FILL' 1"
              }}
            >
              grid_view
            </span>

            Dashboard
          </button>

          {/* Management */}
          <p className={sectionTitle}>
            Management
          </p>

          <button
            onClick={() => setActiveTab('blogs')}
            className={menuClass('blogs')}
          >
            <span className="material-symbols-outlined">
              article
            </span>

            Blog Management
          </button>

          <button
            onClick={() => setActiveTab('galleries')}
            className={menuClass('galleries')}
          >
            <span className="material-symbols-outlined">
              collections
            </span>

            Gallery Management
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={menuClass('packages')}
          >
            <span className="material-symbols-outlined">
              inventory_2
            </span>

            Package Management
          </button>

          <button
            onClick={() => setActiveTab('ratings')}
            className={menuClass('ratings')}
          >
            <span className="material-symbols-outlined">
              star_rate
            </span>

            Ratings & Reviews
          </button>

          {/* Analytics */}
          <p className={`${sectionTitle}`}>
            Analytics
          </p>

          <button
            onClick={() => setActiveTab('statistics')}
            className={menuClass('statistics')}
          >
            <span className="material-symbols-outlined">
              monitoring
            </span>

            Statistics
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="
              mt-auto
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-red-300
              hover:bg-red-500/10
              hover:text-red-200
              transition-all
            "
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            Sign Out
          </button>

        </nav>

      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}