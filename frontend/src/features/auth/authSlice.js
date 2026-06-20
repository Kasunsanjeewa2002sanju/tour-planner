import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import {
  buildInitialAuthState,
  clearStoredAuth,
  persistAuth,
  userFromToken,
} from './authUtils';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    persistAuth(response.data.token, response.data.user);
    if (response.data.expiresIn) {
      localStorage.setItem('tokenExpiresIn', response.data.expiresIn);
    }
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const response = await api.get('/users/me', { _skipAuthLogout: true });
      const profile = response.data;
      const user = {
        id: profile._id || profile.id,
        email: profile.email,
        role: profile.role,
      };
      persistAuth(token, user);
      return { token, user, profile };
    } catch (err) {
      if (err.response?.status === 401) {
        clearStoredAuth();
      }
      return rejectWithValue(err.response?.data || { message: 'Session expired' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: buildInitialAuthState(),
  reducers: {
    logout: (state) => {
      clearStoredAuth();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.sessionLoading = false;
      state.authInitialized = true;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.authInitialized = true;
        state.sessionLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(restoreSession.pending, (state) => {
        state.sessionLoading = true;
        const token = localStorage.getItem('token');
        if (token && !state.user) {
          state.user = userFromToken(token);
          state.token = token;
          state.isAuthenticated = true;
        }
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.sessionLoading = false;
        state.authInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.sessionLoading = false;
        state.authInitialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setAuthenticatedUser } = authSlice.actions;
export default authSlice.reducer;
