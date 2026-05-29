'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useCompareStore, ComparedCollege } from '@/store/compareStore';
import { useToastStore } from '@/store/toastStore';
import StarRating from '@/components/shared/StarRating';
import { CollegeDetailSkeleton } from '@/components/shared/Skeletons';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  MapPin, 
  Landmark, 
  IndianRupee, 
  Briefcase, 
  Maximize2, 
  Home, 
  CheckCircle, 
  Award, 
  BookOpen, 
  ChevronRight,
  Heart,
  GitCompare,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface Params {
  id: string;
}

export default function CollegeDetailPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const collegeIdOrSlug = resolvedParams.id;
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const { user, savedCollegeIds, toggleSavedCollege } = useAuthStore();
  const { colleges: comparedColleges, addCollege, removeCollege } = useCompareStore();
  const { addToast } = useToastStore();

  // Fetch college profile detail
  const { data, isLoading, isError } = useQuery({
    queryKey: ['collegeDetail', collegeIdOrSlug],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${collegeIdOrSlug}`);
      if (!res.ok) throw new Error('College not found');
      return res.json();
    },
  });

  if (isLoading) return <CollegeDetailSkeleton />;

  if (isError || !data?.college) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 px-4">
        <ShieldAlert size={48} className="mx-auto text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">College Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The page you are looking for does not exist or has been relocated.</p>
        <a 
          href="/colleges" 
          className="inline-flex rounded-xl bg-violet-650 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 shadow-md shadow-violet-550/20"
        >
          Back to Discover
        </a>
      </div>
    );
  }

  const college = data.college;
  const summary = data.ratingSummary;

  const isSaved = savedCollegeIds.includes(college.id);
  const isCompared = comparedColleges.some((c) => c.id === college.id);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹amount.toLocaleString('en-IN')`;
  };

  const handleSave = async () => {
    if (!user) {
      addToast('Please login to bookmark colleges.', 'info');
      return;
    }
    const success = await toggleSavedCollege(college.id);
    if (success) {
      addToast(isSaved ? 'Bookmark removed' : 'College added to bookmarks!', 'success');
    }
  };

  const handleCompareToggle = () => {
    if (isCompared) {
      removeCollege(college.id);
      addToast('College removed from comparison.', 'info');
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
        courses: college.courses.map((c: any) => ({ name: c.name, feesAnnual: c.feesAnnual })),
      };

      const result = addCollege(mapped);
      if (result.success) {
        addToast(result.message, 'success');
      } else {
        addToast(result.message, 'error');
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'placements', label: 'Placements' },
    { id: 'reviews', label: `Reviews (${summary.totalReviews})` },
    { id: 'admission', label: 'Admission' },
    { id: 'facilities', label: 'Facilities' },
  ];

  // Combine hero image + gallery images
  const allImages = [college.image, ...college.gallery];

  // Format Recharts Chart Data
  const chartData = college.placements.map((p: any) => ({
    year: p.year.toString(),
    'Average Package': p.avgPackage,
    'Highest Package': p.highestPackage,
  }));

  // Top recruiters summary (deduped list from recent placement data)
  const topRecruiters = Array.from(
    new Set(college.placements.flatMap((p: any) => p.topRecruiters as string[]))
  ).slice(0, 12) as string[];

  const facilitiesList = [
    { name: 'Hostel Accommodation', available: college.hostelAvailable, icon: '🏠' },
    { name: 'Central Library', available: true, icon: '📚' },
    { name: 'Advanced Science Labs', available: true, icon: '🧪' },
    { name: 'Hi-Tech Computer Centre', available: true, icon: '💻' },
    { name: 'Sports Complex & Gym', available: true, icon: '⚽' },
    { name: 'Wi-Fi Enabled Campus', available: true, icon: '📶' },
    { name: 'Cafeteria & Dining Hall', available: true, icon: '🍔' },
    { name: 'Medical/First Aid Facilities', available: true, icon: '🏥' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-6">
        <Link href="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight size={12} className="text-slate-400" />
        <Link href="/colleges" className="hover:text-slate-800">Colleges</Link>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-slate-600 truncate max-w-xs">{college.name}</span>
      </div>

      {/* Image Gallery & Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Main image viewer with contrasting bottom gradient */}
        <div className="lg:col-span-8 relative h-80 md:h-[450px] rounded-3xl bg-slate-900 overflow-hidden border border-slate-100 shadow-md">
          <img
            src={allImages[selectedImageIdx]}
            alt={college.name}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{college.name}</h1>
            <div className="flex items-center gap-3 text-slate-200 text-sm mt-3">
              <span className="flex items-center gap-1 font-bold">
                <MapPin size={14} className="text-violet-400" />
                {college.city}, {college.state}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span className="flex items-center gap-1 font-bold">
                <Landmark size={14} className="text-indigo-400" />
                {college.ownershipType} University
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail grid */}
        <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-3 h-24 lg:h-[450px]">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIdx(idx)}
              className={`relative rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all cursor-pointer ${
                selectedImageIdx === idx ? 'border-violet-500 scale-95 shadow-md shadow-violet-500/10' : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover lg:h-[136px]" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Tabs Navigation & Details Content */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tabs Navigation */}
          <div className="sticky top-16 z-20 flex gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 p-1.5 backdrop-blur-md overflow-x-auto shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-extrabold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-violet-650 text-white shadow-md shadow-violet-550/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/40 p-6 md:p-8 backdrop-blur-sm min-h-[400px] linear-glow shadow-sm">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6 text-left">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 mb-4 tracking-tight">About the Institution</h2>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {college.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6 mt-2">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
                    <Maximize2 className="text-violet-655 mb-2" size={20} />
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Campus Size</span>
                    <span className="text-md font-extrabold text-slate-800 mt-1">{college.campusSize} Acres</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
                    <Home className="text-indigo-650 mb-2" size={20} />
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Hostel</span>
                    <span className="text-md font-extrabold text-slate-800 mt-1">{college.hostelAvailable ? 'Available' : 'Day Scholar'}</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
                    <TrendingUp className="text-emerald-600 mb-2" size={20} />
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Placement Rate</span>
                    <span className="text-md font-extrabold text-slate-800 mt-1">{college.placementPercent.toFixed(0)}%</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center text-center">
                    <IndianRupee className="text-amber-600 mb-2" size={20} />
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Min Fees</span>
                    <span className="text-md font-extrabold text-slate-800 mt-1">{formatCurrency(college.feesMin).split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="flex flex-col text-left">
                <h2 className="text-xl font-bold text-slate-850 mb-6 tracking-tight">Offered Courses & Fees Structure</h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200/60 bg-slate-50/60">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-100/50">
                        <th className="p-4 font-bold text-slate-600">Course Name</th>
                        <th className="p-4 font-bold text-slate-600 text-center">Duration</th>
                        <th className="p-4 font-bold text-slate-600 text-center">Seats</th>
                        <th className="p-4 font-bold text-slate-600 text-right">Annual Fees</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {college.courses.map((course: any) => (
                        <tr key={course.id} className="hover:bg-white/40 transition-colors">
                          <td className="p-4 font-semibold text-slate-800">{course.name}</td>
                          <td className="p-4 text-center text-slate-550">{course.duration} Years</td>
                          <td className="p-4 text-center text-slate-550">{course.seats}</td>
                          <td className="p-4 text-right font-extrabold text-violet-600">{formatCurrency(course.feesAnnual)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Placements Tab */}
            {activeTab === 'placements' && (
              <div className="flex flex-col gap-8 text-left">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 mb-2 tracking-tight">Placement Highlights</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    The college boasts an active Training and Placement Cell that recruits top corporations from tech, consulting, banking, and core manufacturing.
                  </p>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl text-center shadow-inner">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Average Salary Package</span>
                    <span className="text-3xl font-extrabold text-slate-800">₹{college.avgPackage.toFixed(1)} LPA</span>
                  </div>
                  <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl text-center shadow-inner">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Highest Package Reached</span>
                    <span className="text-3xl font-extrabold text-gradient-gold">₹{college.highestPackage.toFixed(1)} LPA</span>
                  </div>
                  <div className="border border-slate-100 bg-slate-50/50 p-5 rounded-2xl text-center shadow-inner">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Placement Success Rate</span>
                    <span className="text-3xl font-extrabold text-emerald-600">{college.placementPercent.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Placement Chart */}
                <div className="border border-slate-200/60 bg-white/60 p-5 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">Packages Trend (2023 - 2025)</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={10} fontWeight={700} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} fontWeight={700} tickLine={false} unit="L" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.08)', borderRadius: 12 }} 
                          labelStyle={{ color: '#0f172a', fontWeight: 'bold' }} 
                        />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Bar dataKey="Average Package" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Highest Package" fill="#ea580c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Recruiters */}
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Top Recruiters visiting Campus</h3>
                  <div className="flex flex-wrap gap-2">
                    {topRecruiters.map((company, idx) => (
                      <span
                        key={idx}
                        className="inline-flex rounded-xl bg-white border border-slate-100 px-4 py-2.5 text-xs font-bold text-slate-650 shadow-sm"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-8 text-left">
                {/* Aggregate Header */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-6 border-b border-slate-200 pb-8">
                  <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-extrabold text-slate-800">{summary.averageRating.toFixed(1)}</span>
                    <span className="text-xs font-semibold text-slate-500 mt-1">out of 5.0 stars</span>
                    <div className="mt-3">
                      <StarRating rating={summary.averageRating} size={18} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 mt-2">Based on {summary.totalReviews} student reviews</span>
                  </div>

                  {/* Rating distribution progress bars */}
                  <div className="sm:col-span-8 flex flex-col gap-2">
                    {summary.distribution.map((dist: any) => (
                      <div key={dist.stars} className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-slate-500 w-12 text-right">{dist.stars} stars</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                          <div 
                            className="h-full bg-violet-600 rounded-full" 
                            style={{ width: `${dist.percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-600 w-12">{dist.count} ({dist.percentage.toFixed(0)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review comments list */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Student Comments</h3>
                  <div className="flex flex-col gap-6">
                    {college.reviews.map((review: any) => (
                      <div key={review.id} className="border border-slate-100 bg-slate-50/30 p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">{review.user.name}</span>
                            {review.isVerified && (
                              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-100">
                                <UserCheck size={10} />
                                Verified Student
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <StarRating rating={review.rating} size={12} />
                        <p className="text-slate-650 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Admission Tab */}
            {activeTab === 'admission' && (
              <div className="flex flex-col gap-6 text-sm text-left">
                <h2 className="text-xl font-bold text-slate-850 mb-2 tracking-tight">Admission Process</h2>
                
                <div className="flex flex-col gap-4 text-slate-550 leading-relaxed">
                  <p>
                    Admissions to {college.name} are strictly merit-based and processed via national or state-level examinations.
                  </p>
                  
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-650 text-xs font-bold border border-violet-200">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Entrance Exams Requirement</h4>
                        <p className="text-xs">
                          {college.name.includes("IIT") 
                            ? "Requires clearing JEE Main and qualifying for JEE Advanced for B.Tech programs." 
                            : college.name.includes("IIM") 
                            ? "Requires a high percentile in the Common Admission Test (CAT) followed by writing tests and personal interviews."
                            : "Accepts state JEE exams, COMEDK, CAT, MAT, or college-specific evaluation tests."}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-650 text-xs font-bold border border-violet-200">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Eligibility Criteria</h4>
                        <p className="text-xs">
                          Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics (or equivalent) with a minimum of 60-75% aggregate marks for undergraduate programs, or possess a bachelor's degree with 50%+ for MBA courses.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-650 text-xs font-bold border border-violet-200">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">Counselling & Seat Allocation</h4>
                        <p className="text-xs">
                          Selected candidates will participate in centralized counseling (e.g. JoSAA for IITs, or standard portal for other colleges) to select specialized streams based on merit rank.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="flex flex-col text-left">
                <h2 className="text-xl font-bold text-slate-850 mb-6 tracking-tight">Campus Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facilitiesList.map((fac, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between border rounded-2xl p-4 transition-all duration-200 ${
                        fac.available 
                          ? 'border-slate-100 bg-white text-slate-700 shadow-sm' 
                          : 'border-slate-100 opacity-40 text-slate-400 bg-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-3 font-semibold text-sm">
                        <span className="text-lg">{fac.icon}</span>
                        {fac.name}
                      </span>
                      {fac.available && (
                        <span className="inline-flex rounded-full bg-emerald-50 p-0.5 text-white">
                          <CheckCircle size={14} className="text-emerald-600" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Sticky Factsheet Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="sticky top-24 rounded-3xl border border-slate-200/60 bg-white/60 p-6 backdrop-blur-md flex flex-col gap-6 linear-glow text-left shadow-sm">
            
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Overall Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-slate-800">{college.rating.toFixed(1)}</span>
                <StarRating rating={college.rating} size={16} />
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-4 flex flex-col gap-3 text-xs font-bold">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Landmark size={14} className="text-violet-500" />
                  Ownership
                </span>
                <span className="font-extrabold text-slate-800">{college.ownershipType}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-500" />
                  Location
                </span>
                <span className="font-extrabold text-slate-800">{college.city}, {college.state}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Maximize2 size={14} className="text-blue-500" />
                  Campus Size
                </span>
                <span className="font-extrabold text-slate-800">{college.campusSize} Acres</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Home size={14} className="text-emerald-500" />
                  Hostel Boarding
                </span>
                <span className="font-extrabold text-slate-800">{college.hostelAvailable ? 'Available' : 'Day Scholar'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <IndianRupee size={14} className="text-amber-500" />
                  Fees Range
                </span>
                <span className="font-extrabold text-slate-800">
                  {formatCurrency(college.feesMin).split(' ')[0]} - {formatCurrency(college.feesMax).split(' ')[0]}/yr
                </span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="border-t border-slate-200/60 pt-6 flex flex-col gap-3">
              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold border transition-all duration-200 cursor-pointer shadow-sm ${
                  isSaved
                    ? 'border-rose-500 bg-rose-50 text-rose-650 hover:bg-rose-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart size={16} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
                {isSaved ? 'Shortlisted' : 'Bookmark College'}
              </button>

              <button
                onClick={handleCompareToggle}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 cursor-pointer shadow-md shadow-violet-550/10 ${
                  isCompared
                    ? 'bg-violet-550/15 border border-violet-200 text-violet-650 hover:bg-violet-100'
                    : 'bg-violet-600 text-white hover:bg-violet-500'
                }`}
              >
                <GitCompare size={16} />
                {isCompared ? 'Added to Compare' : 'Add to Comparison'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
