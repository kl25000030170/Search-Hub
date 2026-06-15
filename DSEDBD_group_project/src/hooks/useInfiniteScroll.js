import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback, isLoading, hasMore) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [callback, isLoading, hasMore]);

  return observerRef;
};

export default useInfiniteScroll;
