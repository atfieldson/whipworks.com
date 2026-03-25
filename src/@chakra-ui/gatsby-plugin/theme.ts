import { ThemeOverride, extendTheme } from '@chakra-ui/react';
import '@fontsource-variable/domine';
import '@fontsource-variable/josefin-sans';

const theme: ThemeOverride = {
  breakpoints: {
    sm: '30em',
    md: '51.5625em', // 825px
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  //   colors: {
  //     primary: 'rebeccapurple',
  //   },
  //   semanticTokens: {
  //     maxContentWidth: ''
  //   }
  colors: {
    gray: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#463d3e',
    },
  },
  styles: {
    global: {
      body: {
        backgroundColor: '#1a140f',
      },
    },
  },
  fonts: {
    body: 'Josefin Sans Variable',
    heading: 'Domine Variable',
  },
  semanticTokens: {
    colors: {
      dark: '#1a140f',
    },
    space: {
      xs: '1',
      sm: '2',
      md: '4',
      lg: '8',
      xl: '12',
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'blue.200',
          fontWeight: 'bold',
          color: 'dark',
          _hover: {
            bg: 'blue.600',
          },
        },
      },
      defaultProps: {
        size: 'lg',
      },
    },
  },
};

export default extendTheme(theme);
