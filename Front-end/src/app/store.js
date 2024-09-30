import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../app/user/userSlice'
import storage from 'redux-persist/lib/storage'; // Use localStorage for web
import { persistStore, persistReducer } from 'redux-persist';



const persistConfig = {
    key: 'root',
    storage,
    version: 1,
  };

  const persistedUserReducer = persistReducer(persistConfig, userReducer); // Persisted reducer



export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Use persisted reducer
  },

      middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for persist
      }),
});

export const persistor = persistStore(store); // Create a persistor


// export const store = configureStore({
//     reducer: {
//       user: persistedUserReducer, // Use persisted reducer
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false, // Disable serializable check for persist
//       }),
//   });