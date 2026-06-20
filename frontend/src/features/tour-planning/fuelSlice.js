import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchFuelPrices = createAsyncThunk(
  'fuel/fetchFuelPrices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fuel/prices');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchAdminFuelPrices = createAsyncThunk(
  'fuel/fetchAdminFuelPrices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/fuel/admin/prices');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateFuelPrices = createAsyncThunk(
  'fuel/updateFuelPrices',
  async (prices, { rejectWithValue }) => {
    try {
      const response = await api.put('/fuel/admin/prices', prices);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const fuelSlice = createSlice({
  name: 'fuel',
  initialState: {
    prices: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearFuelError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelPrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFuelPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
      })
      .addCase(fetchFuelPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch fuel prices';
      })
      .addCase(fetchAdminFuelPrices.fulfilled, (state, action) => {
        state.prices = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminFuelPrices.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to load fuel prices';
      })
      .addCase(updateFuelPrices.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateFuelPrices.fulfilled, (state, action) => {
        state.saving = false;
        state.prices = action.payload;
      })
      .addCase(updateFuelPrices.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || 'Failed to update fuel prices';
      });
  },
});

export const { clearFuelError } = fuelSlice.actions;
export default fuelSlice.reducer;
