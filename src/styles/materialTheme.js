import {
  darken,
  lighten,
} from '@material-ui/core/styles/colorManipulator';

export const lato = [
  'Lato',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

export const futura = [
  'Futura',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
].join(',');

const blackColor = '#1a1a1a';
const whiteColor = '#ffffff';

export default primaryColor => {
  const lightPrimaryColor = lighten(primaryColor, 0.7);
  const darkPrimaryColor = darken(primaryColor, 0.2);

  return {
    palette: {
      common: {
        black: blackColor,
      },
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: darkPrimaryColor,
      },
      paper: {
        main: '#eeeeee',
      },
      text: {
        primary: blackColor,
      },
    },
    typography: {
      fontFamily: lato,
      h2: {
        fontFamily: futura,
      },
      h3: {
        fontFamily: futura,
      },
      h5: {
        fontFamily: futura,
      },
      body1: {
        fontWeight: 300,
      },
      body2: {
        fontWeight: 300,
      },
      caption: {
        fontWeight: 300,
      },
      subtitle1: {
        fontSize: '1.1em',
      },
    },
    overrides: {
      MuiTableCell: {
        root: {
          fontStyle: 'unset',
        },
      },
      MuiButton: {
        label: {
          letterSpacing: '0.1em',
        },
        root: {
          borderRadius: 10000,
          padding: '6px 20px',
          fontWeight: 600,
        },
        outlined: {
          padding: '6px 20px',
        },
        outlinedSizeSmall: {
          padding: '4px 12px',
        },
        containedSecondary: {
          backgroundColor: lightPrimaryColor,
        },
        contained: {
          backgroundColor: whiteColor,
        },
      },
    },
  };
};
