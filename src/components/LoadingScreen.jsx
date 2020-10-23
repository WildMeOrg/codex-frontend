import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function LoadingScreen() {
  const theme = useTheme();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSpinner(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Backdrop open={showSpinner}>
      <CircularProgress
        style={{ color: theme.palette.common.white }}
      />
    </Backdrop>
  );
}
