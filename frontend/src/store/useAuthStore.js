import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authApi from '../api/authApi';

const MOCK_USERS = [
  {
    name: 'Demo User',
    email: 'user@example.com',
    password: 'password123',
    role: 'USER',
  },
  {
    name: 'Platform Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      registeredUsers: MOCK_USERS,

      login: async (email, password) => {
        try {
          const res = await authApi.loginUser(email, password);
          const token = res?.token || res?.access_token;
          const user = res?.user || res;
          if (token) {
            localStorage.setItem('jwt_token', token);
            const cleanUser = {
              name: user.name || user.username,
              email: user.email,
              role: user.role || 'USER',
            };
            set({ isAuthenticated: true, user: cleanUser });
            return { success: true };
          }
        } catch {
          // fall through to local auth
        }

        const { registeredUsers } = get();
        const found = registeredUsers.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (found) {
          const cleanUser = {
            name: found.name,
            email: found.email,
            role: found.role || 'USER',
          };
          set({ isAuthenticated: true, user: cleanUser });
          localStorage.setItem('jwt_token', 'mock_jwt_token');
          return { success: true };
        }

        return { success: false, message: 'Invalid email or password' };
      },

      register: async (userData) => {
        try {
          const res = await authApi.registerUser(userData);
          if (res?.success !== false) {
            return { success: true };
          }
        } catch {
          // local registration
        }

        const { registeredUsers } = get();
        const exists = registeredUsers.some(
          (u) => u.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (exists) {
          return { success: false, message: 'User with this email already registered' };
        }

        const newUser = {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: 'USER',
        };

        set({ registeredUsers: [...registeredUsers, newUser] });
        return { success: true };
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
        localStorage.removeItem('jwt_token');
      },

      checkAuth: () => {
        const token = localStorage.getItem('jwt_token');
        const { user } = get();
        if (token && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false, user: null });
        }
      },

      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'search-platform-auth',
      partialize: (state) => ({
        registeredUsers: state.registeredUsers,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
