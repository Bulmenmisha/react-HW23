import { configureStore } from '@reduxjs/toolkit';
import authReducer, { checkTokenExpirationMiddleware } from '../features/auth/authSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenExpirationMiddleware),
});

export default store;
