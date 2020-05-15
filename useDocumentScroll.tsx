import { useEffect, useState } from 'react';
import { throttle } from 'lodash';

export type ScrollData = {
  currentScrollTop: number;
  previousScrollTop: number;
};

const useDocumentScrollThrottled = (callback: (data: ScrollData) => void) => {
  const [, setScrollPosition] = useState(0);
  let previousScrollTop = 0;

  function handleDocumentScroll() {
    const { scrollTop: currentScrollTop } = document.documentElement || document.body;

    setScrollPosition((previousPosition) => {
      previousScrollTop = previousPosition;
      return currentScrollTop;
    });

    callback({ previousScrollTop, currentScrollTop });
  }

  const handleDocumentScrollThrottled = throttle(handleDocumentScroll, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleDocumentScrollThrottled);

    return () => window.removeEventListener('scroll', handleDocumentScrollThrottled);
  }, []);
};

export default useDocumentScrollThrottled;
