import { extendTheme } from "native-base";

export const THEME = extendTheme({
  colors: {
    primary: {
      700: '#835AFD'
    },
    tooltip: {
      200: '#F5B2FF',
      400: '#E559F9',
      500: '#D303F5',
      600: '#9249A6',
    },
    background: {
      50: '#ffffff',
      200: '#F8F8F8',
      300: '#DBDCDD',
      400: '#CECECE',
      500: '#8C8C8C',
      600: '#737373',
      700: '#595959',
      800: '#404040'
    },
    attention: {
      400: '#D73754',
      500: '#E73F5D'
    },
    alert: {
      600: '#F26101'
    },
    details: {
      200: '#BFF2A7',
      500: '#64BF39',
    },
    isHighlighted: {
    100: '#f4f0ff',
    800: '#835afd',
    }
  },
  fonts: {
    heading: 'Roboto_700Bold',
    body: 'Roboto_400Regular'
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
  },
  sizes: {
    14: 56
  }
});