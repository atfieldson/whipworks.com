import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    /*
     * Viewport meta: without this, mobile browsers (and Chrome DevTools device
     * emulation) use a ~980px default layout viewport and scale down, which
     * breaks `100vw` calculations and responsive breakpoints. Gatsby does NOT
     * add this automatically — it must be declared here so it ships in the
     * server-rendered HTML on first paint.
     */
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1"
    />,
    <script
      key="scroll-restoration"
      dangerouslySetInnerHTML={{
        __html: `if (window.history) { window.history.scrollRestoration = 'manual'; }`,
      }}
    />,
  ]);
};
