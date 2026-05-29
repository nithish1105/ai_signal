'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  GitCompare, 
  Bookmark, 
  Award, 
  TrendingUp, 
  Users, 
  Building,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import CollegeCard from '@/components/college/CollegeCard';
import { CollegeCardSkeleton } from '@/components/shared/Skeletons';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch top-rated colleges for featured section
  const { data, isLoading } = useQuery({
    queryKey: ['featuredColleges'],
    queryFn: async () => {
      const res = await fetch('/api/colleges?limit=3&sortBy=rating');
      if (!res.ok) throw new Error('Failed to fetch colleges');
      return res.json();
    }
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/colleges');
    }
  };

  const stats = [
    { label: 'Verified Colleges', value: '100+', icon: <Building className="text-violet-600" size={20} /> },
    { label: 'Different Streams', value: '4+', icon: <Award className="text-indigo-600" size={20} /> },
    { label: 'Active Students', value: '15k+', icon: <Users className="text-blue-600" size={20} /> },
    { label: 'Avg Placement Success', value: '88%', icon: <TrendingUp className="text-emerald-600" size={20} /> },
  ];

  const recruiters = [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", 
    "Goldman Sachs", "Morgan Stanley", "J.P. Morgan", "McKinsey", 
    "BCG", "TCS", "Infosys", "Wipro", "Cognizant", "Accenture",
    "Deloitte", "HDFC Bank", "ICICI Bank", "Reliance", "Tata Motors"
  ];

  const testimonials = [
    {
      quote: "UniFind made comparing top business schools incredibly straightforward. I found detailed placement metrics that other portals simply didn't show.",
      author: "Rohan Mehta",
      role: "MBA Candidate, IIM Bangalore",
      rating: 5
    },
    {
      quote: "The admission probability metrics and fee transparency saved me weeks of research. The UI/UX feels like a premium utility tool.",
      author: "Priya Sharma",
      role: "B.Tech Student, IIT Delhi",
      rating: 5
    },
    {
      quote: "Being able to shortlist colleges and compare their packages side-by-side with actual verified placement reviews is a game changer.",
      author: "Aditya Sen",
      role: "Alumni, BITS Pilani",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How reliable are the placement statistics listed?",
      answer: "Our placement data is gathered directly from verified student submissions, public institutional NIRF disclosure logs, and official placement cell reports, ensuring highly accurate numbers."
    },
    {
      question: "Can I compare colleges across different education streams?",
      answer: "Yes. Our multi-faceted comparison tool allows you to compare colleges side-by-side even if they offer B.Tech, MBA, or B.Sc degrees, displaying custom annual fees per stream."
    },
    {
      question: "Is there any cost associated with using the comparison tool?",
      answer: "No, UniFind is a completely free open platform built for students to research, shortlist, and analyze higher education choices without hidden counseling fee structures."
    }
  ];

  return (
    <div className="flex flex-col w-full pb-28 relative">
      
      {/* Soft background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[60%] h-[400px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute top-[600px] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-600/3 blur-[140px]" />
        <div className="absolute bottom-[300px] left-[5%] w-[400px] h-[400px] rounded-full bg-blue-600/3 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          {/* Decorative badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1.5 text-xs font-bold text-violet-700 border border-violet-100 mb-8 shadow-sm">
            <Sparkles size={12} className="text-violet-600" />
            The Smartest Way to Plan College
          </span>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.1] mb-6">
            Discover Your Perfect College <span className="text-gradient">Future</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed mb-12">
            Compare top Indian institutions, explore verified reviews, examine detailed courses/fees, and make informed admission decisions with confidence.
          </p>

          {/* Search Bar with glowing wrap */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl w-full relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-xl">
              <Search className="absolute left-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by college name, city, or state (e.g. IIT Bombay)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              <button
                type="submit"
                className="rounded-xl px-6 py-3.5 text-sm font-bold text-white stripe-btn cursor-pointer whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

        </div>
      </section>

      {/* Recruiter Marquee Ticker */}
      <section className="w-full border-y border-slate-200/60 bg-white/40 py-8 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">
            Top Recruiters Visiting Featured Campuses
          </span>
        </div>

        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[...recruiters, ...recruiters].map((rec, i) => (
            <span key={i} className="text-sm font-extrabold text-slate-400 hover:text-violet-600 transition-colors uppercase tracking-widest cursor-default">
              {rec}
            </span>
          ))}
        </div>
      </section>

      {/* Stats Section with glowing box */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl border border-slate-200/80 bg-white/40 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden linear-glow shadow-sm">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 relative group hover:bg-slate-50/50 rounded-2xl transition-colors duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-4 shadow-inner group-hover:border-violet-500/30 transition-colors">
                {stat.icon}
              </div>
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
              <span className="text-xs font-semibold text-slate-500 mt-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features CTAs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col p-8 rounded-3xl border border-slate-100 framer-card linear-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10 transition-all duration-300" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <GitCompare className="h-6 w-6 text-violet-650" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Compare Colleges Side-by-Side</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Pick up to 3 colleges and compare their average package, highest package, annual courses fee, location, and campus size instantly.
            </p>
            <Link
              href="/compare"
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors uppercase tracking-wider"
            >
              Start Comparing &rarr;
            </Link>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col p-8 rounded-3xl border border-slate-100 framer-card linear-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-600/5 blur-3xl group-hover:bg-indigo-600/10 transition-all duration-300" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <Bookmark className="h-6 w-6 text-indigo-650" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Save & Shortlist Favorites</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Create a free account, save the colleges you're interested in, and access them anytime from your personalized dashboard.
            </p>
            <Link
              href="/auth/signup"
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-855 transition-colors uppercase tracking-wider"
            >
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-28">
        <div className="flex items-end justify-between mb-10">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Featured Top-Rated Colleges</h2>
            <p className="text-slate-500 text-sm mt-1">Based on student ratings, placements, and infrastructure reviews.</p>
          </div>
          <Link
            href="/colleges"
            className="text-xs font-bold text-violet-600 hover:text-violet-850 hidden sm:flex items-center gap-1 uppercase tracking-wider"
          >
            Browse All 
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CollegeCardSkeleton />
            <CollegeCardSkeleton />
            <CollegeCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.colleges?.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-28">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-700 border border-violet-100 uppercase tracking-widest mb-4">
            <MessageSquare size={10} /> Student Testimonials
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Loved by aspirants & students</h2>
          <p className="text-slate-500 text-sm mt-2">Hear from students who found their path using UniFind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="flex flex-col p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:bg-slate-50/50 hover:shadow-md transition-all duration-300 relative text-left">
              <span className="text-xs font-bold text-amber-500 mb-4">{"★".repeat(t.rating)}</span>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="mt-auto flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">{t.author}</span>
                <span className="text-[11px] text-slate-400 font-semibold mt-0.5">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full mt-28">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold text-violet-700 border border-violet-100 uppercase tracking-widest mb-4">
            <HelpCircle size={10} /> FAQ
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm mt-2">Everything you need to know about navigating the portal.</p>
        </div>

        <div className="flex flex-col gap-4 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-slate-100 bg-white/50 backdrop-blur-sm shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-2 leading-snug">{faq.question}</h4>
              <p className="text-slate-550 text-xs leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
