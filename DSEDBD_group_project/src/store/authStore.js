import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  error: null,

  // Initialize auth state from localStorage
  checkAuth: () => {
    try {
      const currentUser = localStorage.getItem('current_user');
      const usersStr = localStorage.getItem('registered_users') || '[]';
      const users = JSON.parse(usersStr);

      if (!users || users.length === 0) {
        const defaultUser = { name: 'Demo User', email: 'user@example.com', password: 'password123' };
        localStorage.setItem('registered_users', JSON.stringify([defaultUser]));
      }

      if (currentUser) {
        set({
          isAuthenticated: true,
          user: JSON.parse(currentUser),
          error: null
        });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (e) {
      console.error('Failed to parse current user from localStorage:', e);
      set({ isAuthenticated: false, user: null });
    }
  },

  // Log in user
  login: (email, password) => {
    set({ error: null });
    try {
      const usersStr = localStorage.getItem('registered_users') || '[]';
      const users = JSON.parse(usersStr);

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        const sessionUser = { name: user.name, email: user.email };
        localStorage.setItem('current_user', JSON.stringify(sessionUser));
        set({ isAuthenticated: true, user: sessionUser, error: null });
        return { success: true };
      } else {
        const errorMsg = 'Invalid email or password';
        set({ error: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (e) {
      console.error('Login failed:', e);
      const errorMsg = 'An unexpected error occurred';
      set({ error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // Register a new user
  signup: (name, email, password) => {
    set({ error: null });
    try {
      const usersStr = localStorage.getItem('registered_users') || '[]';
      const users = JSON.parse(usersStr);

      // Check if user already exists
      if (users.some(u => u.email === email)) {
        const errorMsg = 'Email is already registered';
        set({ error: errorMsg });
        return { success: false, message: errorMsg };
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(users));

      return { success: true };
    } catch (e) {
      console.error('Signup failed:', e);
      const errorMsg = 'An unexpected error occurred during signup';
      set({ error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // Register alias for store users
  register: (name, email, password) => get().signup(name, email, password),

  // Log out user
  logout: () => {
    localStorage.removeItem('current_user');
    set({ isAuthenticated: false, user: null, error: null });
  }
}));
