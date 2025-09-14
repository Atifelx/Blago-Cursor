import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../app/user/userSlice';
import userArticleReducer from './user/userDataSlice';
import ebookMemoryReducer from './user/ebookMemorySlice';
import storage from 'redux-persist/lib/storage'; // Use localStorage for web
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux'; // Import combineReducers to combine multiple reducers



// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};


// Separate persist config for userArticle data
const userArticlePersistConfig = {
  key: 'userArticle',
  storage, // Save article blocks in the same storage (localStorage)
};

// Separate persist config for ebook memory data
const ebookMemoryPersistConfig = {
  key: 'ebookMemory',
  storage, // Save ebook memory in localStorage
};

const persistedUserArticleReducer = persistReducer(userArticlePersistConfig, userArticleReducer);
const persistedEbookMemoryReducer = persistReducer(ebookMemoryPersistConfig, ebookMemoryReducer);
// Create a persisted reducer for the user slice
const persistedUserReducer = persistReducer(persistConfig, userReducer);


// Combine all your reducers into a rootReducer
const rootReducer = combineReducers({
  user: persistedUserReducer, // Persisted user reducer
  userArticle: persistedUserArticleReducer, // Add userArticleReducer here
  ebookMemory: persistedEbookMemoryReducer, // Add ebookMemory reducer here
  // Add other reducers here if you have any
});


const store = configureStore({
  reducer: rootReducer, // Use the combined rootReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions for serialization checks
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create a persistor for persisting the Redux store
const persistor = persistStore(store);

// Export store and persistor together
export { store, persistor };



