import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  articleChanged,
  brandSelected,
  fetchBrands,
  fetchOffers,
} from "../model/searchSlice";
import {
  selectAnalogueOffers,
  selectSearch,
  selectSelectedOffers,
} from "../model/selectors";

export function usePartsSearch() {
  const dispatch = useDispatch();
  const search = useSelector(selectSearch);
  const selectedOffers = useSelector(selectSelectedOffers);
  const analogueOffers = useSelector(selectAnalogueOffers);
  const { article, selectedBrand } = search;
  const [brandRetry, setBrandRetry] = useState(0);
  const [offerRetry, setOfferRetry] = useState(0);

  useEffect(() => {
    if (!article.trim()) return;
    let request;
    const timer = setTimeout(() => {
      request = dispatch(fetchBrands(article.trim()));
    }, 500);
    return () => {
      clearTimeout(timer);
      request?.abort();
    };
  }, [article, brandRetry, dispatch]);

  useEffect(() => {
    if (!selectedBrand) return;
    const request = dispatch(
      fetchOffers({ number: article.trim(), brand: selectedBrand }),
    );
    return () => request.abort();
  }, [article, selectedBrand, offerRetry, dispatch]);

  return {
    ...search,
    selectedOffers,
    analogueOffers,
    hasArticle: Boolean(article.trim()),
    changeArticle: (value) => dispatch(articleChanged(value)),
    selectBrand: (brand) => dispatch(brandSelected(brand)),
    retryBrands: () => setBrandRetry((value) => value + 1),
    retryOffers: () => setOfferRetry((value) => value + 1),
  };
}
