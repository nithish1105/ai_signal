'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCompareStore } from '@/store/compareStore';
import { 
  GraduationCap, 
  Search, 
  GitCompare, 
  Bookmark, 
  User, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  Home
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const comparedColleges = useCompareStore((state) => state.colleges);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
  };

  return (
    <>
      {/* Top Header for Desktop & Tablet */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 apple-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group logo-3d">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="h-5.5 w-5.5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Uni<span className="text-violet-600">Find</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/colleges" 
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive('/colleges') ? 'text-violet-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Search size={14} />
                Discover
              </Link>
              
              <Link 
                href="/compare" 
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 relative ${
                  isActive('/compare') ? 'text-violet-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <GitCompare size={14} />
                Compare
                {comparedColleges.length > 0 && (
                  <span className="absolute -top-1.5 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-extrabold text-white ring-2 ring-white">
                    {comparedColleges.length}
                  </span>
                )}
              </Link>

              {user && (
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive('/dashboard') ? 'text-violet-600' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <User size={14} className="text-violet-600" />
                    {user.name}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <LayoutDashboard size={14} className="text-slate-400" />
                        My Dashboard
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <Bookmark size={14} className="text-slate-400" />
                        Saved Colleges
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white stripe-btn"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Header user menu trigger */}
            <div className="flex md:hidden items-center gap-3">
              {user ? (
                <Link 
                  href="/dashboard" 
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 text-violet-600 hover:bg-slate-100 transition-all"
                >
                  <User size={16} />
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200 hover:bg-slate-50"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-lg px-6 py-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between pb-safe-bottom">
        {/* Home */}
        <Link 
          href="/" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home size={18} className={isActive('/') ? 'scale-105' : ''} />
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </Link>

        {/* Discover */}
        <Link 
          href="/colleges" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/colleges') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Search size={18} className={isActive('/colleges') ? 'scale-105' : ''} />
          <span className="text-[10px] font-bold tracking-wide">Discover</span>
        </Link>

        {/* Compare */}
        <Link 
          href="/compare" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
            isActive('/compare') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <GitCompare size={18} className={isActive('/compare') ? 'scale-105' : ''} />
          {comparedColleges.length > 0 && (
            <span className="absolute top-0.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[8px] font-extrabold text-white">
              {comparedColleges.length}
            </span>
          )}
          <span className="text-[10px] font-bold tracking-wide">Compare</span>
        </Link>

        {/* Dashboard / Account */}
        <Link 
          href={user ? "/dashboard" : "/auth/login"} 
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            isActive('/dashboard') || isActive('/auth/login') ? 'text-violet-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <LayoutDashboard size={18} className={isActive('/dashboard') ? 'scale-105' : ''} />
          <span className="text-[10px] font-bold tracking-wide">{user ? "Dashboard" : "Account"}</span>
        </Link>
      </nav>
    </>
  );
}
