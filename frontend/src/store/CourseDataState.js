import { create } from 'zustand';

export const useCourseData = create((set) => ({
    courseData: [], 
    setCourseData: (courseData) => set({ courseData })
})); 