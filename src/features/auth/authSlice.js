import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// запросы идут через прокси Vite на http://localhost:5050 (см. vite.config.js)
const API_URL = '/api/auth/';

// проверка срока действия токена (поле exp — в секундах)
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const getErrorMessage = (error) =>
  error.response?.data?.msg || error.response?.data || error.message || 'Ошибка запроса';

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'register', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'login', userData);
    return response.data; // { token }
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// токен из localStorage при старте (если он ещё действителен)
const savedToken = localStorage.getItem('token');
const validToken = savedToken && !isTokenExpired(savedToken) ? savedToken : null;
if (savedToken && !validToken) localStorage.removeItem('token');

const initialState = {
  user: validToken ? jwtDecode(validToken).user : null,
  token: validToken,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isSuccess = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Регистрация прошла успешно! Теперь войдите в аккаунт.';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // вход
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.user = jwtDecode(action.payload.token).user;
        state.message = 'Вы вошли в аккаунт';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

// middleware: при каждом действии проверяем, не истёк ли токен
export const checkTokenExpirationMiddleware = (store) => (next) => (action) => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    store.dispatch(authSlice.actions.logout());
  }
  return next(action);
};

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;
