import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { bibliaApi } from '../services/bibliaApi';
import { brewiarzApi } from '../services/brewiarzApi';
import { niedzielaApi } from '../services/niedzielaApi';
import { notificationsApi } from '../services/notificationsApi';
import { pilgrimageApi } from '../services/pilgrimageApi';
import { quartermasterApi } from '../services/quartermasterApi';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [pilgrimageApi.reducerPath],
};

const rootReducer = combineReducers({
  [bibliaApi.reducerPath]: bibliaApi.reducer,
  [brewiarzApi.reducerPath]: brewiarzApi.reducer,
  [niedzielaApi.reducerPath]: niedzielaApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [quartermasterApi.reducerPath]: quartermasterApi.reducer,
  [pilgrimageApi.reducerPath]: pilgrimageApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      bibliaApi.middleware,
      brewiarzApi.middleware,
      niedzielaApi.middleware,
      notificationsApi.middleware,
      quartermasterApi.middleware,
      pilgrimageApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
