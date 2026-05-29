'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCompareStore, ComparedCollege } from '@/store/compareStore';
import { useToastStore } from '@/store/toastStore';
import StarRating from '@/components/shared/StarRating';
import { 
  GitCompare, 
  Trash2, 
  Search, 
  MapPin, 
  IndianRupee, 
  Briefcase, 
  Maximize2, 
  Home, 
  Plus, 
  X,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function ComparePage() {
  const { colleges, removeCollege, clearCompare, addCollege } = useCompareStore();
  const { addToast } = useToastStore();

  // Search autocomplete states for each slot (slot 0, slot 1, slot 2)
  const [searchQueries, setSearchQueries] = useState<string[]>(['', '', '']);
  const [searchResults, setSearchResults] = useState<any[][]>([[], [], []]);
  const [searchLoading, setSearchLoading] = useState<boolean[]>([false, false, false]);
  const [activeSearchSlot, setActiveSearchSlot] = useState<number | null>(null);

  const searchContainers = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  // Close search dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (activeSearchSlot !== null) {
        const ref = searchContainers[activeSearchSlot];
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setActiveSearchSlot(null);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeSearchSlot]);

  // Handle autocomplete query search
  const handleSearchChange = async (slotIdx: number, query: string) => {
    setSearchQueries((prev) => {
      const next = [...prev];
      next[slotIdx] = query;
      return next;
    });

    if (query.trim().length < 2) {
      setSearchResults((prev) => {
        const next = [...prev];
        next[slotIdx] = [];
        return next;
      });
      return;
    }

    setSearchLoading((prev) => {
      const next = [...prev];
      next[slotIdx] = true;
      return next;
    });

    try {
      const res = await fetch(`/api/colleges?q=${encodeURIComponent(query)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        
        // Filter out colleges that are already added to comparison
        const filtered = data.colleges.filter(
          (c: any) => !colleges.some((cc) => cc.id === c.id)
        );

        setSearchResults((prev) => {
          const next = [...prev];
          next[slotIdx] = filtered;
          return next;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading((prev) => {
        const next = [...prev];
        next[slotIdx] = false;
        return next;
      });
    }
  };

  const handleSelectCollege = (slotIdx: number, college: any) => {
    const mapped: ComparedCollege = {
      id: college.id,
      name: college.name,
      slug: college.slug,
      city: college.city,
      state: college.state,
      ownershipType: college.ownershipType,
      rating: college.rating,
      feesMin: college.feesMin,
      feesMax: college.feesMax,
      avgPackage: college.avgPackage,
      highestPackage: college.highestPackage,
      placementPercent: college.placementPercent,
      campusSize: college.campusSize,
      hostelAvailable: college.hostelAvailable,
      image: college.image,
      courses: college.courses.map((c: any) => ({ name: c.name, feesAnnual: c.feesAnnual })),
    };

    const result = addCollege(mapped);
    if (result.success) {
      addToast(result.message, 'success');
      // Reset search box state
      setSearchQueries((prev) => {
        const next = [...prev];
        next[slotIdx] = '';
        return next;
      });
      setSearchResults((prev) => {
        const next = [...prev];
        next[slotIdx] = [];
        return next;
      });
      setActiveSearchSlot(null);
    } else {
      addToast(result.message, 'error');
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}k`;
  };

  // Compute UniScore
  const calculateScore = (college: ComparedCollege) => {
    const ratingScore = college.rating * 6; // max 30
    const placementScore = college.placementPercent * 0.3; // max 30
    const packageScore = Math.min(40, (college.avgPackage / 25) * 40); // max 40
    return Math.round(ratingScore + placementScore + packageScore);
  };

  // Find best metrics dynamically to highlight them!
  const getBestMetrics = () => {
    if (colleges.length < 2) return {};
    
    let highestAvgPkg = 0;
    let highestMaxPkg = 0;
    let lowestMinFee = Infinity;
    let highestRating = 0;
    let highestScore = 0;

    colleges.forEach((c) => {
      const score = calculateScore(c);
      if (c.avgPackage > highestAvgPkg) highestAvgPkg = c.avgPackage;
      if (c.highestPackage > highestMaxPkg) highestMaxPkg = c.highestPackage;
      if (c.feesMin < lowestMinFee) lowestMinFee = c.feesMin;
      if (c.rating > highestRating) highestRating = c.rating;
      if (score > highestScore) highestScore = score;
    });

    return {
      highestAvgPkg,
      highestMaxPkg,
      lowestMinFee,
      highestRating,
      highestScore,
    };
  };

  const best = getBestMetrics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex flex-col min-h-screen">
      
      {/* Background glow overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 text-left relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GitCompare className="text-violet-600" size={28} />
            Compare Colleges
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compare up to 3 colleges side-by-side on metrics like fees, placements, ratings, and course selections.
          </p>
        </div>

        {colleges.length > 0 && (
          <button
            onClick={clearCompare}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl px-4 py-2.5 border border-rose-200 transition-colors self-start cursor-pointer shadow-sm"
          >
            <Trash2 size={14} />
            Clear Comparison
          </button>
        )}
      </div>

      {colleges.length === 0 ? (
        // Empty State: guide to search
        <div className="flex flex-col items-center justify-center border border-slate-200/80 rounded-3xl bg-white p-16 text-center my-10 max-w-3xl mx-auto relative z-10 backdrop-blur-sm shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 border border-violet-100 mb-6 text-violet-600">
            <GitCompare size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Your Comparison List is Empty</h3>
          <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-8">
            Add colleges from their search cards, or start typing college names in the comparison slots below to configure your analysis dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/colleges"
              className="rounded-xl bg-violet-650 px-6 py-3 text-sm font-bold text-white hover:bg-violet-550 transition-colors inline-flex items-center gap-2 shadow-md shadow-violet-550/20"
            >
              Browse Colleges
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Side-by-side Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 items-stretch relative z-10">
        
        {/* Render Slots (Indices 0, 1, 2) */}
        {Array.from({ length: 3 }).map((_, slotIdx) => {
          const college = colleges[slotIdx];

          if (college) {
            const score = calculateScore(college);
            const isBestMatch = best.highestScore && score === best.highestScore;

            // College Profile slot
            return (
              <div 
                key={college.id}
                className={`flex flex-col rounded-3xl border bg-white overflow-hidden relative shadow-lg transition-all duration-300 ${
                  isBestMatch 
                    ? 'border-violet-500 shadow-violet-500/10 ring-1 ring-violet-400/25' 
                    : 'border-slate-200'
                }`}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeCollege(college.id)}
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/95 text-slate-500 hover:text-rose-600 backdrop-blur-md transition-colors cursor-pointer shadow-sm"
                  title="Remove from comparison"
                >
                  <X size={16} />
                </button>

                {/* Cover Image & Basic Info */}
                <div className="h-44 relative bg-slate-900">
                  <img src={college.image} alt={college.name} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {isBestMatch && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-[9px] font-bold text-white shadow-md shadow-violet-500/20 uppercase tracking-widest">
                      <Sparkles size={10} />
                      Best Match
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[9px] font-bold text-violet-600 bg-white border border-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                      {college.ownershipType}
                    </span>
                    <h3 className="font-extrabold text-base text-white mt-2 leading-tight truncate">{college.name}</h3>
                    <p className="text-slate-200 text-xs mt-1 flex items-center gap-1 font-semibold">
                      <MapPin size={11} className="text-slate-400" />
                      {college.city}, {college.state}
                    </p>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="p-5 flex-1 flex flex-col gap-5 text-sm divide-y divide-slate-100 text-left">
                  
                  {/* UniScore Card */}
                  <div className="pt-0 flex flex-col gap-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">UniScore Rating</span>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1 font-extrabold text-slate-800 text-sm">
                        <Sparkles size={13} className="text-violet-600" />
                        <span>{score} / 100</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full" 
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className={`pt-4 flex items-center justify-between ${
                    best.highestRating && college.rating === best.highestRating ? 'bg-violet-50 -mx-5 px-5' : ''
                  }`}>
                    <span className="text-slate-500 text-xs font-bold">User Rating</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <StarRating rating={college.rating} />
                      {best.highestRating && college.rating === best.highestRating && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700 border border-violet-200">
                          Top
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Annual Fees */}
                  <div className={`pt-4 flex items-center justify-between ${
                    best.lowestMinFee && college.feesMin === best.lowestMinFee ? 'bg-emerald-50 -mx-5 px-5' : ''
                  }`}>
                    <span className="text-slate-500 text-xs font-bold">Fees Range (Annual)</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <div className="flex items-center text-slate-700">
                        <IndianRupee size={12} className="text-violet-600 mr-0.5" />
                        <span>{formatCurrency(college.feesMin)} - {formatCurrency(college.feesMax)}</span>
                      </div>
                      {best.lowestMinFee && college.feesMin === best.lowestMinFee && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                          Lowest
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avg Placement Package */}
                  <div className={`pt-4 flex items-center justify-between ${
                    best.highestAvgPkg && college.avgPackage === best.highestAvgPkg ? 'bg-violet-50 -mx-5 px-5' : ''
                  }`}>
                    <span className="text-slate-500 text-xs font-bold">Avg Salary Package</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <div className="flex items-center text-slate-700">
                        <Briefcase size={12} className="text-indigo-650 mr-1" />
                        <span>₹{college.avgPackage.toFixed(1)} LPA</span>
                      </div>
                      {best.highestAvgPkg && college.avgPackage === best.highestAvgPkg && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-750 border border-violet-200">
                          Max
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Highest package */}
                  <div className={`pt-4 flex items-center justify-between ${
                    best.highestMaxPkg && college.highestPackage === best.highestMaxPkg ? 'bg-amber-50 -mx-5 px-5' : ''
                  }`}>
                    <span className="text-slate-500 text-xs font-bold">Highest Package</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <div className="flex items-center text-slate-700">
                        <TrendingUp size={12} className="text-amber-600 mr-1" />
                        <span>₹{college.highestPackage.toFixed(1)} LPA</span>
                      </div>
                      {best.highestMaxPkg && college.highestPackage === best.highestMaxPkg && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200">
                          Max
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Placement percentage */}
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-bold">Placement Rate</span>
                    <span className="font-bold text-slate-700">{college.placementPercent.toFixed(0)}% Placed</span>
                  </div>

                  {/* Campus Size */}
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-bold">Campus Size</span>
                    <div className="flex items-center font-bold text-slate-700">
                      <Maximize2 size={12} className="text-slate-400 mr-1" />
                      <span>{college.campusSize} Acres</span>
                    </div>
                  </div>

                  {/* Hostel accommodation */}
                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-bold">Hostel Option</span>
                    <div className="flex items-center font-bold text-slate-700">
                      <Home size={12} className="text-slate-400 mr-1" />
                      <span>{college.hostelAvailable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Top Courses listing */}
                  <div className="pt-4 flex-grow flex flex-col gap-2">
                    <span className="text-slate-500 text-xs font-bold">Featured Courses</span>
                    <div className="flex flex-col gap-1.5">
                      {college.courses.slice(0, 4).map((crs, cIdx) => (
                        <div key={cIdx} className="flex justify-between text-xs border border-slate-100 bg-slate-50/50 p-2 rounded-lg">
                          <span className="font-bold text-slate-750 truncate max-w-[150px]">{crs.name}</span>
                          <span className="font-extrabold text-slate-500">{formatCurrency(crs.feesAnnual)}/yr</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA link details */}
                  <div className="pt-5 mt-auto">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="block w-full text-center rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
                    >
                      Visit Profile
                    </Link>
                  </div>

                </div>
              </div>
            );
          } else {
            // Empty Search slot
            return (
              <div 
                key={`empty-${slotIdx}`}
                ref={searchContainers[slotIdx]}
                className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-250 bg-white/60 p-8 text-center min-h-[500px] relative transition-colors duration-300 hover:border-violet-400 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 mb-4">
                  <Plus size={20} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Add College</h4>
                <p className="text-slate-500 text-xs mt-1 mb-5 max-w-[200px] mx-auto font-bold">
                  Search and add another college to compare side-by-side.
                </p>

                {/* Autocomplete Input Search */}
                <div className="relative w-full group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-650 rounded-xl blur opacity-15 group-focus-within:opacity-35 transition duration-500" />
                  <div className="relative flex items-center rounded-xl bg-white border border-slate-200 group-focus-within:border-violet-500/40 shadow-sm">
                    <Search className="absolute left-3.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Type college name..."
                      value={searchQueries[slotIdx]}
                      onFocus={() => setActiveSearchSlot(slotIdx)}
                      onChange={(e) => handleSearchChange(slotIdx, e.target.value)}
                      className="w-full bg-transparent py-2.5 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 outline-none"
                    />
                    {searchQueries[slotIdx] && (
                      <button
                        onClick={() => {
                          setSearchQueries((prev) => {
                            const n = [...prev]; n[slotIdx] = ''; return n;
                          });
                          setSearchResults((prev) => {
                            const n = [...prev]; n[slotIdx] = []; return n;
                          });
                        }}
                        className="absolute right-3 text-slate-400 hover:text-slate-800 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete results dropdown overlay */}
                  {activeSearchSlot === slotIdx && (searchResults[slotIdx].length > 0 || searchLoading[slotIdx]) && (
                    <div className="absolute left-0 right-0 mt-2 z-30 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl max-h-56 overflow-y-auto text-left">
                      {searchLoading[slotIdx] ? (
                        <div className="py-2.5 px-3 text-xs text-slate-400 text-center font-bold">Searching...</div>
                      ) : (
                        searchResults[slotIdx].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectCollege(slotIdx, item)}
                            className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <span className="text-xs font-bold text-slate-800 leading-tight truncate">{item.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{item.city}, {item.state}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}

      </div>
    </div>
  );
}
