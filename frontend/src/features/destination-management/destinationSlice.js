import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchDestinations = createAsyncThunk('destinations/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/destinations');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const addDestination = createAsyncThunk('destinations/add', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/destinations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateDestination = createAsyncThunk('destinations/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/destinations/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteDestination = createAsyncThunk('destinations/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/destinations/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const toggleBookmark = createAsyncThunk('destinations/toggleBookmark', async (id, { rejectWithValue }) => {
  try {
    const response = await api.post(`/destinations/${id}/bookmark`);
    return { id, ...response.data };
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchSavedDestinations = createAsyncThunk('destinations/fetchSaved', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/destinations/saved');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const destinationSlice = createSlice({
  name: 'destinations',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDestinations: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch destinations';
      })
      .addCase(addDestination.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload.id);
        if (index !== -1) {
          state.items[index].isBookmarked = action.payload.isBookmarked;
        }
      })
      .addCase(fetchSavedDestinations.fulfilled, (state, action) => {
        state.items = action.payload; // Replaces list with only saved items when requested
      });
  },
});

export const { clearDestinations } = destinationSlice.actions;
export default destinationSlice.reducer;
