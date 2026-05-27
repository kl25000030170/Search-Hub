import { useRef, useCallback } from 'react';

export const useInfiniteScroll = (callback, loading, hasMore) => {
  const observerRef = useRef(null);

  const ref = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, callback]
  );

  return ref;
};

export default useInfiniteScroll;
