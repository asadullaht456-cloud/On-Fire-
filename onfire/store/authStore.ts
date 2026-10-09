import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../utils/authService';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Pick<User, 'id' | 'name' | 'email'> | null;
  setCurrentUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      setCurrentUser: (user) => set({ 
        isAuthenticated: true, 
        currentUser: { id: user.id, name: user.name, email: user.email } 
      }),
      logout: () => set({ isAuthenticated: false, currentUser: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
