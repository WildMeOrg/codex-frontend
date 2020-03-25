import React from 'react';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import AppHeader from './components/AppHeader';

export default function App() {
  const theme = createMuiTheme({
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
  });

  return (
    <ThemeProvider theme={theme}>
      <main
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          color: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          fontFamily: 'Franklin Gothic Medium',
        }}
      >
        <AppHeader />
      </main>
    </ThemeProvider>
  );
}
