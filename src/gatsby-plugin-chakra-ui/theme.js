import { theme } from '@chakra-ui/core';

export default {
  ...theme,
  fonts: {
    body: "'Josefin Sans', serif",
    heading: "'Domaine Display', Helvetica, sans-serif",
  },

  maxContentWidth: '1020px',
  colors: {
    ...theme.colors,
    gray: {
      50: '#faf9f9',
      100: '#eeeded',
      200: '#e2e0e0',
      300: '#d5d2d2',
      400: '#c6c3c3',
      500: '#b6b2b2',
      600: '#a49e9e',
      700: '#8f8787',
      800: '#736a69',
      900: '#463d3e',
    },
  },
};
