import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import pastSearchesReducer from '@/store/pastSearchesSlice';
import { RootState } from './types';

export const store = configureStore({
  reducer: {
    pastSearches: pastSearchesReducer,
  },
});

// Create a custom hook for typed dispatch
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 