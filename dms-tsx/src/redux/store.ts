import { configureStore } from '@reduxjs/toolkit';
import folderReducer from './slices/folderSlice';
import authReducer from './slices/authSlice'
export const store = configureStore({
  reducer: {
    folders: folderReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;