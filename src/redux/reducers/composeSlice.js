import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createCanvas } from "canvas";
import { v4 as uuid } from "uuid";
import {
	convertToPinataLinks,
	getIpfsHash,
	getIpfsHashFromFile,
} from "../../utils";
import { ComposeNft } from "../../contract";

const sortOrder = (tmpObj) => {
	return Object.keys(tmpObj)
		.sort()
		.reduce((acc, key) => {
			acc[key] = tmpObj[key];
			return acc;
		}, {});
};

export const EQUIPPTYPE = {
	ADD: "ADD",
	REMOVE: "REMOVE",
	DISCARD: "DISCARD",
};

export const equippedAction = createAsyncThunk(
	"compose/equippedAction",
	async ({ key, value, reset, type }, { getState, rejectWithValue }) => {
		try {
			// debugger;
			const { compose } = getState();
			const { equipped, defaultItem } = compose;
			let tmpObj = {
				equipped: { ...equipped },
				defaultItem: { ...defaultItem },
			};
			let file = null;
			let preview = null;

			switch (type) {
				case EQUIPPTYPE.ADD:
					tmpObj.equipped = reset
						? { [key.toLowerCase()]: value }
						: { ...tmpObj.equipped, [key.toLowerCase()]: value };

					if (value?.default) {
						tmpObj.defaultItem = {
							[key.toLowerCase()]: value,
						};
					}
					break;
				case EQUIPPTYPE.REMOVE:
					if (!tmpObj.equipped[key.toLowerCase()]?.default) {
						delete tmpObj.equipped[key.toLowerCase()];
						const defaultKey = Object.keys(tmpObj.defaultItem);
						if (key.toLowerCase() === defaultKey[0]) {
							tmpObj.equipped[key.toLowerCase()] =
								tmpObj.defaultItem[key];
						}
					}
					break;
				case EQUIPPTYPE.DISCARD:
					tmpObj.equipped = { ...tmpObj.defaultItem };
					break;
				default:
					tmpObj = { ...tmpObj };
					break;
			}
			tmpObj.equipped = sortOrder(tmpObj.equipped);

			const canvas = createCanvas(2000, 2000);
			const ctx = canvas.getContext("2d");

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const imageLinks = Object.keys(tmpObj.equipped).map(
				(key) => tmpObj.equipped[key]?.image
			);

			const converted = convertToPinataLinks(imageLinks);
			console.log("imageLinks", converted);

			for (let i = 0; i < converted.length; i++) {
				const image = converted[i];
				await new Promise((resolve, reject) => {
					const img = new Image();
					img.src = image;
					img.crossOrigin = "anonymous";
					img.onload = () => {
						// Draw the image at a specific position
						ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
						resolve();
					};
				});
			}

			// console.log("canvas", canvas.toDataURL());
			preview = canvas.toDataURL();

			await new Promise((resolve, reject) => {
				canvas.toBlob((blob) => {
					const createdfile = new File(
						[blob],
						`${uuid()}-${Date.now()}-composed_image.png`,
						{
							type: "image/png",
						}
					);
					// Now you have a File object that you can use or upload as needed
					console.log(createdfile);
					file = createdfile;
					resolve();
				});
			});

			return {
				...tmpObj,
				file,
				preview,
			};
		} catch (err) {
			console.log("err", err);
			rejectWithValue(err.message);
		}
	}
);

export const composeNftAction = createAsyncThunk(
	"compose/composeNftAction",
	async ({ provider }, { getState, rejectWithValue }) => {
		try {
			let order =["God Tier","Legendary","Ultra Rare","Rare","Special","Common"]
			let rarity=[]
			let rarityValue=null
			const { compose } = getState();
			const { file, equipped } = compose;

			const hash = await getIpfsHashFromFile(file);
			// https://ipfs.hex.toys/ipfs/${hash}

			const attributes = Object.keys(equipped).map((ele) => ({
				trait_type: equipped[ele]?.attributes[0]?.trait_type,
				value: equipped[ele]?.attributes[0]?.value,
			}));
			Object.keys(equipped).forEach((ele) => {
				rarity.push(equipped[ele]?.attributes[1]?.value);

			});
			console.log(order,rarity)
			for(let i=0;i<order.length;i++){
				for(let j=0;j<rarity.length;j++){
					if(rarity[j]===order[i]){
						rarityValue=rarity[j]
						break;
					}
				}
				if (rarityValue) {
					break; // Exit the outer loop if a match is found
				}

			}

			

			// console.log('rarity', rarity)
            // console.log('equipped composeNftAction', equipped)
		    // console.log('attributes', attributes)

			// console.log('rarityValue', rarityValue)
			//TODO: calculate rarity

			//temparory
			const randomName = Math.random() * Number.MAX_SAFE_INTEGER;

			const metaData = {
				name: `#Heart-Head-${randomName}`,
				description: `Heart-Heads.com`,
				image: `https://ipfs.hex.toys/ipfs/${hash}`,
				attributes: [
					attributes[0],
					{
						trait_type: "rarity",
						value: rarityValue,
					},
					{
						trait_type: "composed",
						value: true,
					},
					...attributes.slice(1, attributes.length),
				],
			};
			const uri = await getIpfsHash(metaData);
			const result = await ComposeNft(
				`https://ipfs.hex.toys/ipfs/${uri}`,
				provider
			);
			if(result) {
				return result;
			}
			return rejectWithValue('fail');
		} catch (err) {
			console.log("err.message", err.message);
			return rejectWithValue(err.message);
		}
	}
);

const initialState = {
	imageLoading:false,
	loading: false,
	equipped: {},
	defaultItem: {},
	file: null,
	preview: null,
};

const composeSlice = createSlice({
	name: "compose",
	initialState,

	extraReducers: (builder) => {
		builder
			.addCase(equippedAction.pending, (state, action) => {
				state.imageLoading = true;
			})
			.addCase(equippedAction.fulfilled, (state, { payload }) => {
				console.log("payload", payload);
				state.imageLoading = false;
				state.equipped = payload.equipped;
				state.defaultItem = payload.defaultItem;
				state.file = payload.file;
				state.preview = payload.preview;
			})
			.addCase(equippedAction.rejected, (state, action) => {
				state.imageLoading = false;
			})
			.addCase(composeNftAction.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(composeNftAction.fulfilled, (state, { payload }) => {
				state.loading = false;
			})
			.addCase(composeNftAction.rejected, (state, action) => {
				state.loading = false;
			});
	},
});

export const composeReducer = composeSlice.reducer;

export const composeState = (state) => state.compose;

export const { removeFromEquip } = composeSlice.actions;
