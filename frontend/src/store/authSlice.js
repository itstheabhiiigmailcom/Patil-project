// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI, logoutAPI, currentUserAPI } from '../api/auth';

/* ── THUNKS ─────────────────────────────────────────── */
export const login = createAsyncThunk(
  'auth/login',
  async (cred, { rejectWithValue }) => {
    try {
      return await loginAPI(cred); // { id, email, role, ... }
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await registerAPI(data);
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await currentUserAPI(); // { id, email, role, ... }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutAPI(); // clears cookie on server
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ── SLICE ──────────────────────────────────────────── */
const initialState = {
  user: null, // or { id, email, role, ... }
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {}, // no client‑side logout reducer needed
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading';
      state.error = null;
    };
    const rejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload || action.error.message;
    };
    const fulfilledWithUser = (state, { payload }) => {
      state.status = 'succeeded';
      state.user = payload;
      state.error = null;
    };

    builder
      // login / register
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilledWithUser)
      .addCase(login.rejected, rejected)

      .addCase(register.pending, pending)
      .addCase(register.fulfilled, fulfilledWithUser)
      .addCase(register.rejected, rejected)

      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, pending)
      .addCase(fetchCurrentUser.fulfilled, fulfilledWithUser)
      .addCase(fetchCurrentUser.rejected, rejected) // ← now status = 'failed'

      // logout
      .addCase(logout.pending, pending)
      .addCase(logout.fulfilled, (state) => {
        state.status = 'failed';
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, rejected);
  },
});

export default authSlice.reducer;
