const avenirNext = [
  'Avenir Next',
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

const avenirNextCondensed = [
  'Avenir Next Condensed',
  'Avenir Next',
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

export default {
  palette: {
    primary: {
      main: '#070500',
    },
    secondary: {
      main: '#8B38DD',
    },
    paper: {
      main: '#eeeeee',
    },
  },
  typography: {
    fontFamily: avenirNext,
    h2: {
      fontFamily: avenirNextCondensed,
    },
  },
};
