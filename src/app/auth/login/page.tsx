'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { GraduationCap, ArrowRight, Mail, Lock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, checkAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hydrate redirect path if provided
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // If already logged in, redirect to path
  React.useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      addToast('Welcome back! Logged in successfully.', 'success');
      
      // Hydrate state
      await checkAuth();

      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex flex-1 flex-col items-center justify-center max-w-md w-full px-4 py-16">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-xl shadow-indigo-500/20 mb-4">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sign in to UniFind</h2>
        <p className="text-slate-400 text-sm mt-1">Access your saved colleges list and comparisons dashboard.</p>
      </div>

      {/* Glassmorphic Form Card */}
      <div className="w-full rounded-3xl border border-white/5 bg-slate-900/25 p-8 backdrop-blur-md shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-400">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-500" size={16} />
              <input
                type="email"
                placeholder="e.g. user@domain.com"
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
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 border-t border-white/5 pt-4 text-center">
          <p className="text-xs text-slate-400">
            New to UniFind?{' '}
            <Link href="/auth/signup" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto flex flex-1 flex-col items-center justify-center max-w-md w-full px-4 py-16">
        <div className="w-full rounded-3xl border border-white/5 bg-slate-900/25 p-8 backdrop-blur-md shadow-2xl h-96 flex items-center justify-center animate-pulse">
          <div className="text-slate-400 text-sm font-semibold">Loading Form...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
