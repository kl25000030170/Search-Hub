import useProductStore from '../store/useProductStore';

export const useProducts = () => {
  const store = useProductStore();
  return store;
};

export default useProducts;
