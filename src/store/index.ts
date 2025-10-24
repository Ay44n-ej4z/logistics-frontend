import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { masterDataApi } from './api/masterDataApi';
import { jobsApi } from './api/jobsApi';
import { houseAwbsApi } from './api/houseAwbsApi';
import { masterAwbsApi } from './api/masterAwbsApi';
import authSlice from './slices/authSlice';
import { toastMiddleware } from './middleware/toastMiddleware';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [masterDataApi.reducerPath]: masterDataApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [houseAwbsApi.reducerPath]: houseAwbsApi.reducer,
    [masterAwbsApi.reducerPath]: masterAwbsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(toastMiddleware)
      .concat(authApi.middleware)
      .concat(masterDataApi.middleware)
      .concat(jobsApi.middleware)
      .concat(houseAwbsApi.middleware)
      .concat(masterAwbsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
