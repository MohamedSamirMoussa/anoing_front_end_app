import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./features/authSlice";
import theme from "./features/themeSlice";
import leaderboard from "./features/leaderboardSlice";
import donate from "./features/donateSlice";
import blogs from "./features/blogSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import superSlice from './features/superSlice';

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth" , "theme" , "leaderboard" , "donate" , "superSlice" , "blogs"],
};

const rootReducer = combineReducers({
  auth,
  theme,
  leaderboard,
  donate,
  superSlice,
  blogs
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
