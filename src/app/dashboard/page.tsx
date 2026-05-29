'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useCompareStore } from '@/store/compareStore';
import { useToastStore } from '@/store/toastStore';
import CollegeCard from '@/components/college/CollegeCard';
import { CollegeListSkeleton } from '@/components/shared/Skeletons';
import { 
  Bookmark, 
  GitCompare, 
  ArrowRight, 
  User, 
  Activity,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const comparedColleges = useCompareStore((state) => state.colleges);
  const { addToast } = useToastStore();

  // Fetch saved/bookmarked colleges
  const { data, isLoading, isError } = useQuery({
    queryKey: ['savedColleges'],
    queryFn: async () => {
      const res = await fetch('/api/saved-colleges');
      if (!res.ok) throw new Error('Failed to fetch bookmarks');
      return res.json();
    },
    enabled: !!user, // Only fetch if user is loaded
  });

  // Saved Colleges List
  const savedColleges = data?.colleges || [];

  const stats = [
    { label: 'Saved Colleges', value: savedColleges.length, icon: <Heart className="text-rose-600" size={18} /> },
    { label: 'Compared Colleges', value: comparedColleges.length, icon: <GitCompare className="text-violet-650" size={18} /> },
    { label: 'Active Searches', value: '1', icon: <Activity className="text-emerald-600" size={18} /> },
  ];

  if (!user) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 px-4">
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-6">Please log in to access your personal dashboard.</p>
        <Link 
          href="/auth/login" 
          className="inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-500 shadow-md shadow-violet-550/20"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex flex-col gap-8">
      {/* Background glow overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/40 p-6 md:p-8 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden linear-glow shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-600/5 blur-3xl" />
        
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-gradient">{user.name}</span>!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your shortlisted institutions, track your comparative reviews, and select your course preferences.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
            <User size={20} className="text-violet-600" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="border border-slate-200/80 bg-white/50 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden linear-glow hover:border-violet-500/15 transition-colors">
            <div className="text-left">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">{stat.label}</span>
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Saved Colleges Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="text-violet-600" size={20} />
              My Saved Colleges
            </h2>
            <p className="text-slate-500 text-xs mt-1">Colleges you bookmarked for admissions consideration.</p>
          </div>
          {savedColleges.length > 0 && (
            <Link 
              href="/colleges" 
              className="text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-850 flex items-center gap-1.5 cursor-pointer"
            >
              Add More
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        {isLoading ? (
          <CollegeListSkeleton count={3} />
        ) : isError ? (
          <div className="text-center py-10 border border-slate-250 bg-white rounded-2xl text-slate-500 font-bold shadow-sm">
            Failed to load bookmarks. Please try refreshing.
          </div>
        ) : savedColleges.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-250 bg-white/40 rounded-3xl flex flex-col items-center justify-center max-w-2xl mx-auto backdrop-blur-sm shadow-sm">
            <Bookmark className="text-slate-400 mb-4" size={32} />
            <h3 className="text-md font-bold text-slate-800">No Saved Colleges</h3>
            <p className="text-slate-500 text-xs mt-1.5 mb-6 max-w-sm leading-relaxed font-bold">
              When browsing colleges, click the heart icon on any card to save it here for easier accessibility.
            </p>
            <Link
              href="/colleges"
              className="rounded-xl bg-violet-650 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-violet-550 transition-colors shadow-md shadow-violet-550/20"
            >
              Discover Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>

      {/* Comparisons Section */}
      {comparedColleges.length > 0 && (
        <div className="border-t border-slate-200/60 pt-8 mt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GitCompare className="text-violet-600" size={20} />
                Recent Comparisons
              </h2>
              <p className="text-slate-550 text-xs mt-1">Colleges currently in your active comparison list.</p>
            </div>
            <Link 
              href="/compare" 
              className="text-xs font-bold uppercase tracking-wider text-violet-600 hover:text-violet-850 flex items-center gap-1.5 cursor-pointer"
            >
              Open Comparison Tool
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparedColleges.map((college) => (
              <div 
                key={college.id} 
                className="border border-slate-200/80 bg-white p-4 rounded-2xl flex items-center justify-between hover:border-violet-100 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col text-left truncate">
                  <span className="font-bold text-xs text-slate-800 truncate">{college.name}</span>
                  <span className="text-[10px] text-slate-500 font-bold mt-0.5 truncate">{college.city}, {college.state}</span>
                </div>
                <Link
                  href="/compare"
                  className="p-2 text-violet-600 hover:text-violet-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
