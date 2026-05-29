import { create } from 'zustand';

export interface ComparedCollege {
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
  courses: Array<{ name: string; feesAnnual: number }>;
}

interface CompareState {
  colleges: ComparedCollege[];
  addCollege: (college: ComparedCollege) => { success: boolean; message: string };
  removeCollege: (collegeId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  colleges: [],

  addCollege: (college) => {
    const { colleges } = get();
    
    // Check if already in comparison
    if (colleges.some((c) => c.id === college.id)) {
      return { success: false, message: 'College is already added to comparison.' };
    }

    // Restrict to max 3
    if (colleges.length >= 3) {
      return { 
        success: false, 
        message: 'You can compare a maximum of 3 colleges at once. Remove a college to add this one.' 
      };
    }

    set({ colleges: [...colleges, college] });
    return { success: true, message: `${college.name} added to comparison.` };
  },

  removeCollege: (collegeId) => {
    set({
      colleges: get().colleges.filter((c) => c.id !== collegeId),
    });
  },

  clearCompare: () => {
    set({ colleges: [] });
  },
}));
