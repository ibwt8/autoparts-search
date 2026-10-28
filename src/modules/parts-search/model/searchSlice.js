import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { searchParts } from "../api/parts";
import { getBrands, getOffers } from "./normalize";

async function runSearch(params, { signal, rejectWithValue }, transform) {
  try {
    return transform(await searchParts({ ...params, signal }));
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return rejectWithValue(error.message || "Не удалось выполнить поиск.");
  }
}

export const fetchBrands = createAsyncThunk(
  "search/brands",
  (number, api) => runSearch({ number }, api, getBrands),
  {
    condition: (number, { getState }) =>
      Boolean(number.trim()) &&
      getState().search.article.trim() === number.trim(),
  },
);

export const fetchOffers = createAsyncThunk(
  "search/offers",
  (params, api) => runSearch(params, api, getOffers),
  {
    condition: ({ number, brand }, { getState }) => {
      const search = getState().search;
      return (
        Boolean(brand) &&
        number.trim() === search.article.trim() &&
        brand === search.selectedBrand
      );
    },
  },
);

const initialState = {
  article: "",
  brands: [],
  selectedBrand: "",
  offers: [],
  brandsStatus: "idle",
  offersStatus: "idle",
  brandsError: null,
  offersError: null,
  brandsRequestId: null,
  offersRequestId: null,
};

function clearOffers(state) {
  state.offers = [];
  state.offersStatus = "idle";
  state.offersError = null;
  state.offersRequestId = null;
}

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    articleChanged(state, action) {
      state.article = action.payload;
      state.brands = [];
      state.selectedBrand = "";
      state.brandsStatus = "idle";
      state.brandsError = null;
      state.brandsRequestId = null;
      clearOffers(state);
    },
    brandSelected(state, action) {
      if (
        !state.brands.includes(action.payload) ||
        state.selectedBrand === action.payload
      )
        return;
      state.selectedBrand = action.payload;
      clearOffers(state);
    },
  },
  extraReducers: (builder) => {
    for (const [thunk, prefix, resultField] of [
      [fetchBrands, "brands", "brands"],
      [fetchOffers, "offers", "offers"],
    ]) {
      builder
        .addCase(thunk.pending, (state, action) => {
          state[`${prefix}Status`] = "loading";
          state[`${prefix}Error`] = null;
          state[`${prefix}RequestId`] = action.meta.requestId;
          state[resultField] = [];
        })
        .addCase(thunk.fulfilled, (state, action) => {
          if (state[`${prefix}RequestId`] !== action.meta.requestId) return;
          state[resultField] = action.payload;
          state[`${prefix}Status`] = "succeeded";
          state[`${prefix}RequestId`] = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          if (state[`${prefix}RequestId`] !== action.meta.requestId) return;
          state[`${prefix}Status`] = action.meta.aborted ? "idle" : "failed";
          state[`${prefix}Error`] = action.meta.aborted
            ? null
            : action.payload || "Не удалось выполнить поиск.";
          state[`${prefix}RequestId`] = null;
        });
    }
  },
});

export const { articleChanged, brandSelected } = slice.actions;
export const searchReducer = slice.reducer;
