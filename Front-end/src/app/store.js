import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../app/user/userSlice';
import storage from 'redux-persist/lib/storage'; // Use localStorage for web
import { persistStore, persistReducer } from 'redux-persist';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

// Create a persisted reducer for the user slice
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Use the persisted user reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions for serialization
      },
    }),
});

// Create a persistor for persisting the Redux store
const persistor = persistStore(store);

// Export store and persistor together
export { store, persistor };
