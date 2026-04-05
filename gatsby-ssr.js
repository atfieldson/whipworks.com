import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="scroll-restoration"
      dangerouslySetInnerHTML={{
        __html: `if (window.history) { window.history.scrollRestoration = 'manual'; }`,
      }}
    />,
  ]);
};
