import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    persistReducer,
    persistStore,
} from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    auth: authReducer,
});

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer,
);

export const store = configureStore({
    reducer: persistedReducer,

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);