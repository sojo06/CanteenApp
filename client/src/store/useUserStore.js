// src/store/useUserStore.js
import create from 'zustand';

const useUserStore = create((set) => ({
  user: null, // User data
  setUser: (userData) => set({ user: userData }), // Function to set user data
  logout: () => set({ user: null }), // Function to clear user data (logout)
}));

export default useUserStore;
