/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
// import React from 'react';
const React = require('react');

exports.onRenderBody = ({ setPostBodyComponents }, options = {}) => {
  options = Object.assign(
    {
      apiKey: 'NmQxZjU4MTctZmMzZS00MmY0LWJiNWMtMWZjNjA0ZDhlYjE5NjM3MjQ4MDQyMTc1MjE1ODcw',
      autopop: false,
      js: 'https://cdn.snipcart.com/themes/v3.0.18/default/snipcart.js',
      styles: 'https://cdn.snipcart.com/themes/v3.0.18/default/snipcart.css',
    },
    options
  );

  const components = [
    <div
      key="snipcart-main"
      id="snipcart"
      hidden
      data-api-key={options.apiKey}
      data-config-add-product-behavior="none"
    ></div>,
    <script key="snipcartJs" src={options.js}></script>,
  ];
  if (options.styles) {
    components.push(
      <link key="snipcartStyle" href={options.styles} type="text/css" rel="stylesheet" />
    );
  }
  return setPostBodyComponents(components);
};
