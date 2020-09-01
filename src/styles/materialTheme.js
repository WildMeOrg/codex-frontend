import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

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

const colorOptions = ['#D1FD7E', '#8CFD8D', '#68F6E5', '#070500', '#87F0FE', '#CDABFD', '#F1556C', '#FECA75'];

const primaryColor = colorOptions[0];
const lightPrimaryColor = lighten(colorOptions[0], 0.7);
const darkPrimaryColor = darken(colorOptions[0], 0.2);

export default {
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: darkPrimaryColor,
    },
    paper: {
      main: '#eeeeee',
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
        backgroundColor: 'white',
      },
    },
  },
};
