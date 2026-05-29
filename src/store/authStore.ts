import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  savedCollegeIds: string[];
  isLoading: boolean;
  isChecking: boolean;
  setUser: (user: User | null) => void;
  setSavedCollegeIds: (ids: string[]) => void;
  checkAuth: () => Promise<void>;
  toggleSavedCollege: (collegeId: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  savedCollegeIds: [],
  isLoading: false,
  isChecking: true,

  setUser: (user) => set({ user }),
  setSavedCollegeIds: (savedCollegeIds) => set({ savedCollegeIds }),

  checkAuth: async () => {
    try {
      set({ isChecking: true });
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      if (data.user) {
        set({ user: data.user });
        // Hydrate saved colleges
        const savedRes = await fetch('/api/saved-colleges');
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          set({ savedCollegeIds: savedData.colleges.map((c: any) => c.id) });
        }
      } else {
        set({ user: null, savedCollegeIds: [] });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      set({ user: null, savedCollegeIds: [] });
    } finally {
      set({ isChecking: false });
    }
  },

  toggleSavedCollege: async (collegeId: string) => {
    const { user, savedCollegeIds } = get();
    if (!user) return false; // Needs authentication

    const isSaved = savedCollegeIds.includes(collegeId);
    
    // Optimistic Update
    const nextSavedIds = isSaved 
      ? savedCollegeIds.filter(id => id !== collegeId)
      : [...savedCollegeIds, collegeId];
    
    set({ savedCollegeIds: nextSavedIds });

    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-colleges?collegeId=${collegeId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete bookmark');
      } else {
        const res = await fetch('/api/saved-colleges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collegeId }),
        });
        if (!res.ok) throw new Error('Failed to add bookmark');
      }
      return true;
    } catch (error) {
      console.error('Error toggling saved college:', error);
      // Rollback on failure
      set({ savedCollegeIds });
      return false;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ user: null, savedCollegeIds: [] });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
