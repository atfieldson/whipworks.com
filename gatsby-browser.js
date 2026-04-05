import './src/styles/global.css';

export const shouldUpdateScroll = () => {
  return [0, 0];
};

export const onClientEntry = () => {
  // Clear Gatsby's saved scroll positions from sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('@@scroll|')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const onInitialClientRender = () => {
  // Force scroll to top after hydration, overriding any delayed scroll restoration
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
};

export const onRouteUpdate = () => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
};
