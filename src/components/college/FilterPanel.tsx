'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    q: string;
    state: string;
    city: string;
    feesMax: string;
    rating: string;
    courseType: string;
    ownershipType: string;
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  states: string[];
  cities: string[];
  onClear: () => void;
}

export default function FilterPanel({
  filters,
  setFilters,
  states,
  cities,
  onClear,
}: FilterPanelProps) {
  
  const handleChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value, page: '1' }));
  };

  const feesRanges = [
    { label: 'Any Fees', value: '' },
    { label: 'Under ₹50k/yr', value: '50000' },
    { label: 'Under ₹1.5L/yr', value: '150000' },
    { label: 'Under ₹3.0L/yr', value: '300000' },
    { label: 'Under ₹5.0L/yr', value: '500000' },
  ];

  const ratingOptions = [
    { label: 'Any Star', value: '' },
    { label: '4.5+ ★', value: '4.5' },
    { label: '4.0+ ★', value: '4.0' },
    { label: '3.5+ ★', value: '3.5' },
  ];

  const courseTypes = [
    { label: 'Any Stream', value: '' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Management', value: 'Management' },
    { label: 'Science', value: 'Science' },
    { label: 'Arts', value: 'Arts' },
  ];

  const ownershipTypes = [
    { label: 'Any', value: '' },
    { label: 'Public', value: 'Public' },
    { label: 'Private', value: 'Private' },
  ];

  const sortOptions = [
    { label: 'Rating (High to Low)', value: 'rating' },
    { label: 'Fees (Low to High)', value: 'feesAsc' },
    { label: 'Fees (High to Low)', value: 'feesDesc' },
    { label: 'Placements (High to Low)', value: 'placements' },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 h-fit lg:sticky lg:top-24 shadow-sm text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
          <SlidersHorizontal size={14} className="text-violet-600" />
          Filter Settings
        </h2>
        {(filters.q || filters.state || filters.city || filters.feesMax || filters.rating || filters.courseType || filters.ownershipType || filters.sortBy !== 'rating') && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
          >
            Reset
            <X size={10} />
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
          <ArrowUpDown size={10} className="text-slate-450" />
          Sort Order
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-bold cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* State Chips Grid */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          State
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilters((prev: any) => ({ ...prev, state: '', city: '', page: '1' }))}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all duration-200 cursor-pointer ${
              !filters.state
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All States
          </button>
          {states.map((state) => (
            <button
              key={state}
              onClick={() => setFilters((prev: any) => ({ ...prev, state, city: '', page: '1' }))}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all duration-200 cursor-pointer ${
                filters.state === state
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* City Chips Grid */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          City
        </label>
        {!filters.state ? (
          <span className="text-[11px] text-slate-400 font-semibold italic">Select a state first to view cities</span>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            <button
              onClick={() => handleChange('city', '')}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all duration-200 cursor-pointer ${
                !filters.city
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleChange('city', city)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  filters.city === city
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stream Chips */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          Category Stream
        </label>
        <div className="flex flex-wrap gap-1.5">
          {courseTypes.map((course) => (
            <button
              key={course.value}
              onClick={() => handleChange('courseType', course.value)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition-all duration-200 cursor-pointer ${
                filters.courseType === course.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {course.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fees range */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          Max Annual Fees
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {feesRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleChange('feesMax', range.value)}
              className={`w-full text-left rounded-lg border px-3 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                filters.feesMax === range.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          Minimum Rating
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChange('rating', opt.value)}
              className={`rounded-lg border px-2 py-2 text-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                filters.rating === opt.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ownership Type */}
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          Ownership Type
        </label>
        <div className="flex gap-2">
          {ownershipTypes.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChange('ownershipType', opt.value)}
              className={`flex-1 rounded-lg border py-2 text-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                filters.ownershipType === opt.value
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-slate-200/60 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {opt.label === 'Any' ? 'All' : opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
