'use client';

import React, { useState, useEffect, useDeferredValue, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import FilterPanel from '@/components/college/FilterPanel';
import CollegeCard from '@/components/college/CollegeCard';
import { CollegeListSkeleton } from '@/components/shared/Skeletons';
import { Search, ChevronLeft, ChevronRight, X, SlidersHorizontal } from 'lucide-react';

function CollegesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Initialize filter states from URL search params
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    state: searchParams.get('state') || '',
    city: searchParams.get('city') || '',
    feesMax: searchParams.get('feesMax') || '',
    rating: searchParams.get('rating') || '',
    courseType: searchParams.get('courseType') || '',
    ownershipType: searchParams.get('ownershipType') || '',
    sortBy: searchParams.get('sortBy') || 'rating',
    page: searchParams.get('page') || '1',
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.q);

  // 2. Debounce/Defer the search text query
  const deferredSearch = useDeferredValue(localSearch);

  // Sync deferred search back to filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, q: deferredSearch, page: '1' }));
  }, [deferredSearch]);

  // Sync other URL param changes back to state (e.g. if back button pressed)
  useEffect(() => {
    setFilters({
      q: searchParams.get('q') || '',
      state: searchParams.get('state') || '',
      city: searchParams.get('city') || '',
      feesMax: searchParams.get('feesMax') || '',
      rating: searchParams.get('rating') || '',
      courseType: searchParams.get('courseType') || '',
      ownershipType: searchParams.get('ownershipType') || '',
      sortBy: searchParams.get('sortBy') || 'rating',
      page: searchParams.get('page') || '1',
    });
    setLocalSearch(searchParams.get('q') || '');
  }, [searchParams]);

  // 3. Update URL when filter states change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    router.push(`/colleges?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  // 4. Fetch colleges from API
  const fetchQueryString = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.state) params.set('state', filters.state);
    if (filters.city) params.set('city', filters.city);
    if (filters.feesMax) params.set('feesMax', filters.feesMax);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.courseType) params.set('courseType', filters.courseType);
    if (filters.ownershipType) params.set('ownershipType', filters.ownershipType);
    params.set('sortBy', filters.sortBy);
    params.set('page', filters.page);
    params.set('limit', '9'); // Show 9 per page
    return params.toString();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['colleges', fetchQueryString()],
    queryFn: async () => {
      const res = await fetch(`/api/colleges?${fetchQueryString()}`);
      if (!res.ok) throw new Error('Failed to fetch colleges');
      return res.json();
    },
  });

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage.toString() }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAll = () => {
    setFilters({
      q: '',
      state: '',
      city: '',
      feesMax: '',
      rating: '',
      courseType: '',
      ownershipType: '',
      sortBy: 'rating',
      page: '1',
    });
    setLocalSearch('');
  };

  // Extract pagination info
  const colleges = data?.colleges || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };
  const states = data?.metadata?.states || [];
  const cities = data?.metadata?.cities || [];

  const feesRanges = [
    { label: 'Under ₹50k/yr', value: '50000' },
    { label: 'Under ₹1.5L/yr', value: '150000' },
    { label: 'Under ₹3.0L/yr', value: '300000' },
    { label: 'Under ₹5.0L/yr', value: '500000' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Colleges</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLoading ? 'Searching...' : `Found ${pagination.total} colleges matching your preferences`}
          </p>
        </div>

        {/* Text Search Input with glowing background */}
        <div className="relative max-w-md w-full group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-650 rounded-xl blur opacity-15 group-focus-within:opacity-35 transition duration-350" />
          <div className="relative flex items-center rounded-xl bg-white border border-slate-200 group-focus-within:border-violet-500/50 shadow-sm">
            <Search className="absolute left-3.5 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search college by name, state, or city..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-transparent py-3 pl-11 pr-10 text-sm text-slate-800 placeholder-slate-450 outline-none"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selected Filter Chips Display */}
      {Object.entries(filters).some(([key, val]) => val && key !== 'sortBy' && key !== 'page') && (
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Active Filters:</span>
          {Object.entries(filters).map(([key, val]) => {
            if (!val || key === 'sortBy' || key === 'page') return null;
            let displayVal = val;
            if (key === 'feesMax') {
              const matched = feesRanges.find((r) => r.value === val);
              displayVal = matched ? matched.label : `Under ₹${parseInt(val) / 1000}k`;
            }
            if (key === 'rating') displayVal = `${val}+ Stars`;
            if (key === 'q') displayVal = `"${val}"`;
            
            return (
              <span 
                key={key} 
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-bold text-violet-700 shadow-sm"
              >
                <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mr-0.5">{key}:</span>
                {displayVal}
                <button
                  onClick={() => {
                    if (key === 'q') setLocalSearch('');
                    setFilters((prev: any) => ({ ...prev, [key]: '', page: '1' }));
                  }}
                  className="hover:text-violet-900 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            states={states}
            cities={cities}
            onClear={handleClearAll}
          />
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl mb-4 shadow-sm">
          <span className="text-sm font-semibold text-slate-700">Advanced Filters</span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-650 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            Filters & Sort
          </button>
        </div>

        {/* Colleges Listing Area */}
        <div className="lg:col-span-3 flex flex-col min-h-[500px]">
          {isLoading ? (
            <CollegeListSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center border border-slate-100 rounded-3xl bg-white p-12 text-center my-auto shadow-sm">
              <span className="text-rose-500 font-bold mb-2">Error Loading Data</span>
              <p className="text-slate-500 text-sm">Failed to connect to the server. Please check your connection and try again.</p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-slate-100 rounded-3xl bg-white p-16 text-center my-auto shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-6 text-slate-400">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Colleges Found</h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
                We couldn't find any colleges matching your selected filters. Try broadening your keywords or clearing some filters.
              </p>
              <button
                onClick={handleClearAll}
                className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* College Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map((college: any) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200/60 py-6 mt-12">
                  {/* Mobile Pagination */}
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative ml-3 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-sm"
                    >
                      Next
                    </button>
                  </div>
                  
                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-slate-500">
                        Showing page <span className="font-bold text-slate-800">{pagination.page}</span> of{' '}
                        <span className="font-bold text-slate-800">{pagination.totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="inline-flex -space-x-px rounded-xl border border-slate-200 bg-white p-1.5 gap-1.5 shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                          disabled={pagination.page === 1}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        
                        {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          if (pagination.totalPages > 6) {
                            if (pageNum !== 1 && pageNum !== pagination.totalPages && Math.abs(pageNum - pagination.page) > 1) {
                              if (pageNum === 2 && pagination.page > 3) {
                                return <span key={pageNum} className="px-1.5 text-slate-400 select-none flex items-center h-9 font-bold text-xs">...</span>;
                              }
                              if (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2) {
                                return <span key={pageNum} className="px-1.5 text-slate-400 select-none flex items-center h-9 font-bold text-xs">...</span>;
                              }
                              return null;
                            }
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                                pagination.page === pageNum
                                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                          disabled={pagination.page === pagination.totalPages}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-out Filter Panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay backdrop */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white border-l border-slate-200 p-6 overflow-y-auto shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Filter Settings</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1.5 text-slate-450 hover:bg-slate-100 hover:text-slate-850 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              states={states}
              cities={cities}
              onClear={handleClearAll}
            />

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-violet-650 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-violet-500 text-center cursor-pointer transition-colors shadow-md shadow-violet-550/20"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full text-center py-32">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Discovery Dashboard...</div>
      </div>
    }>
      <CollegesSearch />
    </Suspense>
  );
}
