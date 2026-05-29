'use client';

import { 
  getMockColleges, 
  getMockCollegeByIdOrSlug, 
  mockColleges 
} from './mockDb';

export function setupMockFetch() {
  if (typeof window === 'undefined') return;
  if ((window as any).__mockFetchSetup) return;
  (window as any).__mockFetchSetup = true;

  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const urlString = typeof input === 'string' ? input : (input as any).url || input.toString();

    // We only intercept calls to /api/
    if (urlString.startsWith('/api/') || urlString.includes('/api/')) {
      // Normalize URL relative to current origin
      const url = new URL(urlString, window.location.origin);
      const pathname = url.pathname;
      const cleanPath = pathname.startsWith('/ai_signal') ? pathname.replace('/ai_signal', '') : pathname;
      const searchParams = url.searchParams;

      // Helper to parse JSON body
      const getJsonBody = async () => {
        if (!init || !init.body) return {};
        try {
          if (typeof init.body === 'string') {
            return JSON.parse(init.body);
          }
          if (init.body instanceof Blob) {
            const text = await init.body.text();
            return JSON.parse(text);
          }
          return {};
        } catch {
          return {};
        }
      };

      // Mock Local Storage Database Helpers
      const getLocalStorageUsers = () => {
        try {
          return JSON.parse(localStorage.getItem('unifind_users') || '[]');
        } catch {
          return [];
        }
      };

      const saveLocalStorageUser = (user: any) => {
        const users = getLocalStorageUsers();
        users.push(user);
        localStorage.setItem('unifind_users', JSON.stringify(users));
      };

      const getCurrentUser = () => {
        try {
          const session = localStorage.getItem('unifind_session');
          if (!session) return null;
          return JSON.parse(session);
        } catch {
          return null;
        }
      };

      const getLocalStorageBookmarks = (userId: string) => {
        try {
          const allBookmarks = JSON.parse(localStorage.getItem('unifind_bookmarks') || '{}');
          return allBookmarks[userId] || [];
        } catch {
          return [];
        }
      };

      const saveLocalStorageBookmark = (userId: string, collegeId: string) => {
        try {
          const allBookmarks = JSON.parse(localStorage.getItem('unifind_bookmarks') || '{}');
          if (!allBookmarks[userId]) allBookmarks[userId] = [];
          if (!allBookmarks[userId].includes(collegeId)) {
            allBookmarks[userId].push(collegeId);
          }
          localStorage.setItem('unifind_bookmarks', JSON.stringify(allBookmarks));
        } catch {}
      };

      const removeLocalStorageBookmark = (userId: string, collegeId: string) => {
        try {
          const allBookmarks = JSON.parse(localStorage.getItem('unifind_bookmarks') || '{}');
          if (allBookmarks[userId]) {
            allBookmarks[userId] = allBookmarks[userId].filter((id: string) => id !== collegeId);
          }
          localStorage.setItem('unifind_bookmarks', JSON.stringify(allBookmarks));
        } catch {}
      };

      // 1. GET /api/auth/me
      if (cleanPath === '/api/auth/me') {
        const user = getCurrentUser();
        return new Response(JSON.stringify({ user }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. POST /api/auth/signup
      if (cleanPath === '/api/auth/signup' && init?.method === 'POST') {
        const { name, email, password } = await getJsonBody();
        const users = getLocalStorageUsers();
        if (users.some((u: any) => u.email === email)) {
          return new Response(JSON.stringify({ error: 'User already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const newUser = {
          id: `mock-user-${Date.now()}`,
          name,
          email,
        };
        saveLocalStorageUser({ ...newUser, password });
        localStorage.setItem('unifind_session', JSON.stringify(newUser));
        return new Response(JSON.stringify({ message: 'Registered successfully', user: newUser }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. POST /api/auth/login
      if (cleanPath === '/api/auth/login' && init?.method === 'POST') {
        const { email, password } = await getJsonBody();
        const users = getLocalStorageUsers();
        let user = users.find((u: any) => u.email === email && u.password === password);
        
        if (!user && email === 'student@gmail.com' && password === 'Password123!') {
          user = { id: 'mock-student-id', name: 'Rahul Sharma', email: 'student@gmail.com' };
          saveLocalStorageUser({ ...user, password });
        }

        if (!user) {
          return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const sessionUser = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem('unifind_session', JSON.stringify(sessionUser));
        return new Response(JSON.stringify({ message: 'Logged in successfully', user: sessionUser }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 4. POST /api/auth/logout
      if (cleanPath === '/api/auth/logout' && init?.method === 'POST') {
        localStorage.removeItem('unifind_session');
        return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 5. GET /api/colleges
      if (cleanPath === '/api/colleges') {
        const q = searchParams.get('q') || undefined;
        const state = searchParams.get('state') || undefined;
        const city = searchParams.get('city') || undefined;
        const ownershipType = searchParams.get('ownershipType') || undefined;
        const courseType = searchParams.get('courseType') || undefined;
        const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : null;
        const feesMax = searchParams.get('feesMax') ? parseInt(searchParams.get('feesMax')!, 10) : null;
        const sortBy = searchParams.get('sortBy') || undefined;
        const page = searchParams.get('page') || undefined;
        const limit = searchParams.get('limit') || undefined;

        const resData = getMockColleges({
          q, state, city, ownershipType, rating, feesMax, courseType, sortBy, page, limit
        });

        return new Response(JSON.stringify(resData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 6. GET /api/colleges/[id]
      if (cleanPath.startsWith('/api/colleges/')) {
        const idOrSlug = cleanPath.replace('/api/colleges/', '');
        const resData = getMockCollegeByIdOrSlug(idOrSlug);
        if (!resData) {
          return new Response(JSON.stringify({ error: 'College not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify(resData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 7. /api/saved-colleges
      if (cleanPath === '/api/saved-colleges') {
        const user = getCurrentUser();
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (init?.method === 'GET' || !init?.method) {
          const savedIds = getLocalStorageBookmarks(user.id);
          const colleges = mockColleges.filter((c) => savedIds.includes(c.id));
          return new Response(JSON.stringify({ colleges }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (init?.method === 'POST') {
          const { collegeId } = await getJsonBody();
          saveLocalStorageBookmark(user.id, collegeId);
          return new Response(JSON.stringify({ message: 'College saved successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (init?.method === 'DELETE') {
          const collegeId = searchParams.get('collegeId');
          if (collegeId) {
            removeLocalStorageBookmark(user.id, collegeId);
          }
          return new Response(JSON.stringify({ message: 'College removed successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      // 8. POST /api/compare
      if (cleanPath === '/api/compare' && init?.method === 'POST') {
        const { collegeIds } = await getJsonBody();
        const colleges = mockColleges.filter((c) => collegeIds.includes(c.id));
        return new Response(JSON.stringify({ colleges }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return originalFetch(input, init);
  };
}
