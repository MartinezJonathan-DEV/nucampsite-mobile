import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistCombineReducers,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { campsitesReducer } from "../features/campsites/campsitesSlice";
import { commentsReducer } from "../features/comments/commentsSlice";
import { partnersReducer } from "../features/partners/partnersSlice";
import { promotionsReducer } from "../features/promotions/promotionsSlice";
import { favoritesReducer } from "../features/favorites/favoritesSlice";

// Configuration object for redux-persist
const config = {
  key: "root",
  storage: AsyncStorage,
  debug: true,
};

// Create and export the Redux store using configureStore
export const store = configureStore({
  reducer: persistCombineReducers(config, {
    campsites: campsitesReducer,
    comments: commentsReducer,
    partners: partnersReducer,
    promotions: promotionsReducer,
    favorites: favoritesReducer,
  }),

  // Middleware setup to handle actions that redux-persist ignores during serialization
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create and export the redux-persist store persistor
export const persistor = persistStore(store);
