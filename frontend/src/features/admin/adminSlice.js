import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchAllUsers = createAsyncThunk('admin/fetchAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createUserByAdmin = createAsyncThunk('admin/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteUserByAdmin = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/users/${userId}`);
    return userId;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(createUserByAdmin.fulfilled, (state, action) => {
        // We'll refetch or push
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
