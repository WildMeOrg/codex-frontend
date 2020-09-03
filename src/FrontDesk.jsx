import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import UnauthenticatedSwitch from './UnauthenticatedSwitch';
import AuthenticatedSwitch from './AuthenticatedSwitch';
import useGetMe from './models/users/useGetMe';

export default function FrontDesk() {
  // Display a loading spinner while waiting for authentication status from the server.
  const { data, error } = useGetMe();

  if (data) return <AuthenticatedSwitch />;
  if (error) return <UnauthenticatedSwitch />;

  return (
    <Backdrop style={{ color: 'white' }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
