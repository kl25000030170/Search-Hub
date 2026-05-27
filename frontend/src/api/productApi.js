import { itemApi } from './itemApi';

/** @deprecated Use itemApi — kept for existing imports */
export const productApi = {
  fetchProducts: (params) => itemApi.fetchItems(params),
  fetchProductDetails: (id) => itemApi.fetchItem(id),
};

export default productApi;
