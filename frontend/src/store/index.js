import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: { auth: authReducer },
});

export const useAppDispatch = () => useDispatch(); // typed hook convenience
