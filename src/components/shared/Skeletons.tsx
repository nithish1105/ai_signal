import React from 'react';

// Single College Card Skeleton
export function CollegeCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-slate-900/20 overflow-hidden h-[450px]">
      {/* Image placeholder */}
      <div className="h-48 w-full bg-white/[0.02] animate-shimmer" />
      
      {/* Details placeholder */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div className="h-6 w-3/4 rounded bg-white/[0.03] animate-shimmer" />
        <div className="h-4 w-1/2 rounded bg-white/[0.02] animate-shimmer" />
        
        <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-3 my-2">
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-1/3 rounded bg-white/[0.01] animate-shimmer" />
            <div className="h-4 w-2/3 rounded bg-white/[0.03] animate-shimmer" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-1/3 rounded bg-white/[0.01] animate-shimmer" />
            <div className="h-4 w-2/3 rounded bg-white/[0.03] animate-shimmer" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <div className="h-2 w-1/4 rounded bg-white/[0.01] animate-shimmer" />
          <div className="flex gap-1">
            <div className="h-6 w-16 rounded bg-white/[0.02] animate-shimmer" />
            <div className="h-6 w-16 rounded bg-white/[0.02] animate-shimmer" />
            <div className="h-6 w-16 rounded bg-white/[0.02] animate-shimmer" />
          </div>
        </div>

        <div className="h-10 w-full rounded-xl bg-white/[0.03] animate-shimmer mt-auto" />
      </div>
    </div>
  );
}

// College Grid Listing Skeleton
export function CollegeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CollegeCardSkeleton key={i} />
      ))}
    </div>
  );
}

// College Detail Page Skeleton
export function CollegeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 w-full">
      {/* Hero Banner Skeleton */}
      <div className="h-80 w-full rounded-3xl bg-white/[0.02] animate-shimmer" />

      {/* Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main content skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-12 w-full rounded-xl bg-white/[0.02] animate-shimmer" />
          <div className="h-6 w-1/3 rounded bg-white/[0.03] animate-shimmer mt-4" />
          <div className="h-32 w-full rounded-xl bg-white/[0.02] animate-shimmer" />
          <div className="h-32 w-full rounded-xl bg-white/[0.02] animate-shimmer" />
        </div>

        {/* Right sidebar skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-96 w-full rounded-2xl bg-white/[0.02] animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
