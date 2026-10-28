import { configureStore } from "@reduxjs/toolkit";

import { searchReducer } from "../modules/parts-search";

export const createAppStore = () =>
  configureStore({
    reducer: { search: searchReducer },
  });
