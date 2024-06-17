import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import { composeReducer } from "./reducers/composeSlice";
import { recenetReducer } from "./reducers/recentlyMintSlice";

export const store = configureStore({
	reducer: {
		userStore: userReducer,
		compose: composeReducer,
		recent: recenetReducer,
	},
});
