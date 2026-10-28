import { createSelector } from "@reduxjs/toolkit";

export const selectSearch = (state) => state.search;
const selectOffers = (state) => selectSearch(state).offers;

export const selectSelectedOffers = createSelector([selectOffers], (offers) =>
  offers.filter((offer) => !offer.isAnalogue),
);

export const selectAnalogueOffers = createSelector([selectOffers], (offers) =>
  offers.filter((offer) => offer.isAnalogue),
);
