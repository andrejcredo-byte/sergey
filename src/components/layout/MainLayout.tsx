import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { Sidebar, MobileNav } from './Sidebar';
import { useStore } from '../../store';
import { logOut } from '../../lib/firebase';

export function MainLayout() {
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const { currentUser, setCurrentUser } = useStore();

  const handleLogout = async () => {
    try {
      await logOut();
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar - Desktop */}
      <Sidebar />
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 rounded-md"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="relative" ref={profileRef}>
              <div 
                className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium overflow-hidden cursor-pointer ring-2 ring-transparent transition-all hover:ring-zinc-200"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser?.name.charAt(0).toUpperCase()
                )}
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-zinc-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-medium text-zinc-900 truncate">{currentUser?.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{currentUser?.email}</p>
                  </div>
                  <div className="p-1">
                    <button 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-md transition-colors text-left"
                      onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                    >
                      <User size={16} className="text-zinc-400" />
                      Профиль
                    </button>
                  </div>
                  <div className="p-1 border-t border-zinc-100">
                    <button 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="text-red-500" />
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
