import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  Building2, 
  LayoutDashboard, 
  FolderKanban, 
  Wallet, 
  Package, 
  Users, 
  FileText, 
  Calendar, 
  Settings,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Главная', path: '/' },
  { icon: FolderKanban, label: 'Объекты', path: '/projects' },
  { icon: Wallet, label: 'Финансы', path: '/finance' },
  { icon: Package, label: 'Материалы', path: '/materials' },
  { icon: Users, label: 'Команда', path: '/team' },
];

export function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-zinc-950 text-zinc-300 h-screen fixed top-0 left-0 border-r border-zinc-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-white p-1.5 rounded-lg text-zinc-950">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="font-semibold text-white tracking-tight leading-none text-lg">Моя CRM</h1>
          <p className="text-xs text-zinc-500 mt-1">Construction CRM</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              isActive 
                ? "bg-zinc-800 text-white font-medium" 
                : "hover:bg-zinc-900 hover:text-white"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function MobileNav({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={onClose}>
      <div 
        className="fixed top-0 left-0 bottom-0 w-64 bg-zinc-950 p-6 flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white p-1.5 rounded-lg text-zinc-950">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="font-semibold text-white tracking-tight">Моя CRM</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              onClick={onClose}
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-zinc-800 text-white font-medium" 
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
