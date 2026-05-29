'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCompareStore, ComparedCollege } from '@/store/compareStore';
import { useToastStore } from '@/store/toastStore';
import StarRating from '@/components/shared/StarRating';
import { MapPin, Heart, GitCompare, Landmark, IndianRupee, Briefcase } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  feesAnnual: number;
}

interface Placement {
  id?: string;
  year: number;
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
}

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  ownershipType: string;
  rating: number;
  feesMin: number;
  feesMax: number;
  avgPackage: number;
  highestPackage: number;
  placementPercent: number;
  campusSize: number;
  hostelAvailable: boolean;
  image: string;
  courses: Course[];
  placements: Placement[];
}

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { user, savedCollegeIds, toggleSavedCollege } = useAuthStore();
  const { colleges: comparedColleges, addCollege, removeCollege } = useCompareStore();
  const { addToast } = useToastStore();

  const isSaved = savedCollegeIds.includes(college.id);
  const isCompared = comparedColleges.some((c) => c.id === college.id);

  // Format money helper
  const formatFees = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}k`;
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      addToast('Please login to bookmark colleges.', 'info');
      return;
    }

    const success = await toggleSavedCollege(college.id);
    if (success) {
      addToast(
        isSaved ? 'Bookmark removed' : 'College bookmarked!',
        'success'
      );
    } else {
      addToast('Failed to update bookmarks.', 'error');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeCollege(college.id);
      addToast(`${college.name} removed from compare list.`, 'info');
    } else {
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
        courses: college.courses.map((c) => ({ name: c.name, feesAnnual: c.feesAnnual })),
      };

      const result = addCollege(mapped);
      if (result.success) {
        addToast(result.message, 'success');
      } else {
        addToast(result.message, 'error');
      }
    }
  };

  const displayCourses = college.courses.slice(0, 2);

  return (
    <div className="group relative flex flex-col rounded-3xl border border-slate-100 framer-card linear-glow overflow-hidden animate-3d-entrance">
      {/* Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={college.image}
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

        {/* Ownership badge */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-lg bg-white/90 border border-slate-100 px-2.5 py-1 text-[10px] font-bold text-violet-600 backdrop-blur-sm tracking-wider uppercase shadow-sm">
          <Landmark size={10} className="text-violet-500" />
          {college.ownershipType}
        </span>

        {/* Top actions overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
              isSaved 
                ? 'bg-rose-50 border-rose-100 text-rose-500' 
                : 'bg-white/90 border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-white'
            }`}
            title="Save to shortlist"
          >
            <Heart size={14} className={isSaved ? 'fill-rose-500 text-rose-550 scale-105' : 'transition-transform hover:scale-105'} />
          </button>
          
          <button
            onClick={handleCompare}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
              isCompared 
                ? 'bg-violet-50 border-violet-100 text-violet-600' 
                : 'bg-white/90 border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-white'
            }`}
            title="Add to comparison"
          >
            <GitCompare size={14} className={isCompared ? 'scale-105' : 'transition-transform hover:scale-105'} />
          </button>
        </div>
      </div>

      {/* College Card Details */}
      <div className="flex flex-1 flex-col p-5 text-left bg-white/30 backdrop-blur-sm">
        <Link href={`/colleges/${college.slug}`} className="hover:text-violet-600 transition-colors">
          <h3 className="font-extrabold text-base text-slate-800 leading-snug line-clamp-1 group-hover:text-violet-650 transition-colors duration-200">
            {college.name}
          </h3>
        </Link>

        {/* Location & Rating */}
        <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs font-semibold">
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-slate-400" />
            <span>{college.city}, {college.state}</span>
          </div>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <StarRating rating={college.rating} size={11} />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-3.5 my-4 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Annual Fees</span>
            <div className="flex items-center gap-0.5 font-bold text-slate-700">
              <IndianRupee size={11} className="text-violet-500 shrink-0" />
              <span>{formatFees(college.feesMin)} - {formatFees(college.feesMax)}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Avg Placement</span>
            <div className="flex items-center gap-1 font-bold text-slate-700">
              <Briefcase size={11} className="text-emerald-500 shrink-0" />
              <span>₹{college.avgPackage.toFixed(1)} LPA <span className="font-semibold text-[10px] text-slate-400">({college.placementPercent.toFixed(0)}%)</span></span>
            </div>
          </div>
        </div>

        {/* Course Chips */}
        {displayCourses.length > 0 && (
          <div className="mb-4">
            <span className="text-slate-400 text-[9px] font-bold tracking-widest uppercase block mb-2">Streams Available</span>
            <div className="flex flex-wrap gap-1">
              {displayCourses.map((course) => (
                <span 
                  key={course.id} 
                  className="inline-flex rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-650"
                >
                  {course.name.split(' ').slice(0, 3).join(' ')}
                </span>
              ))}
              {college.courses.length > 2 && (
                <span className="inline-flex rounded-lg bg-violet-50 border border-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-650">
                  +{college.courses.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/colleges/${college.slug}`}
          className="mt-auto block w-full text-center rounded-xl py-2 text-xs font-bold text-slate-700 stripe-btn-secondary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
