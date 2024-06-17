import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const recentMintFetchAction = createAsyncThunk(
	"recenet/recentMintFetchAction",
	async ({ account, mintqut }, { getState, rejectWithValue }) => {
		try {
			let { data } = await axios.get(
				`${process.env.REACT_APP_API}/recentlyMinted_user_hh`,
				{
					params: {
						id: account?.toLowerCase(),
						mintqut,
					},
				}
			);
			let Obj = {
				mintqut,
			};
			if (data?.items?.length) {
				Obj.items = data.items;
			}
			return Obj;
		} catch (e) {
			return rejectWithValue(e.message);
		}
	}
);

const initialState = {
	mintqut: 1,
	loading: false,
	items: [],
};

const recenetSlice = createSlice({
	name: "recent",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(recentMintFetchAction.pending, (state, _) => {
				state.loading = true;
			})
			.addCase(recentMintFetchAction.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.items = payload?.items
					? [...payload?.items, ...state.items]
					: state.items;
				state.mintqut = payload?.mintqut;
			})
			.addCase(recentMintFetchAction.rejected, (state, _) => {
				state.loading = false;
			});
	},
});

export const recenetReducer = recenetSlice.reducer;

export const recenetState = (state) => state.recent;
