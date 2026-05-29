'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { GraduationCap, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      addToast('Account created successfully! Please log in.', 'success');
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center max-w-md w-full px-4 py-16">
      
      {/* Brand logo header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-indigo-500/20 mb-4">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create an account</h2>
        <p className="text-slate-400 text-sm mt-1">Start planning and comparing your college choices.</p>
      </div>

      {/* Glassmorphic Form Card */}
      <div className="w-full rounded-3xl border border-white/5 bg-slate-900/25 p-8 backdrop-blur-md shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
              {error}
            </div>
          )}

          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl glass-input py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-500" size={16} />
              <input
                type="email"
                placeholder="e.g. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl glass-input py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-500" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl glass-input py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-violet-600/20"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 border-t border-white/5 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
