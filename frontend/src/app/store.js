import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import adminReducer from '../features/admin/adminSlice';
import destinationReducer from '../features/destination-management/destinationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
    destinations: destinationReducer,
  },
});
