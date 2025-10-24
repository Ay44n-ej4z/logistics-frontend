import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { authApi } from '../api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.getProfile.matchFulfilled,
        (state, action) => {
          state.user = action.payload.data;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getProfile.matchRejected,
        (state) => {
          // Only clear auth state if we actually had a token (user was supposed to be authenticated)
          // This prevents clearing state on login page when profile fetch fails
          if (state.token) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
            }
          }
        }
      );
  },
});

export const { setCredentials, logout, setLoading, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
