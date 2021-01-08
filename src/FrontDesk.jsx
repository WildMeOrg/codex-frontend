import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import UnauthenticatedSwitch from './UnauthenticatedSwitch';
import AuthenticatedSwitch from './AuthenticatedSwitch';
import useGetMe from './models/users/useGetMe';
import CreateAdminUser from './pages/setup/CreateAdminUser';

export default function FrontDesk({ adminUserInitialized }) {
  // Display a loading spinner while waiting for authentication status from the server.
  const { data, error } = useGetMe();

  return <CreateAdminUser />;
  // if (data && !adminUserInitialized) return <CreateAdminUser />;
  if (data) return <AuthenticatedSwitch />;
  if (error) return <UnauthenticatedSwitch />;

  return (
    <Backdrop style={{ color: 'white' }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
