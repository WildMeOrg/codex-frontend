import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/core/styles';

import UnauthenticatedSwitch from './UnauthenticatedSwitch';
import AuthenticatedSwitch from './AuthenticatedSwitch';
import useGetMe from './models/users/useGetMe';
import CreateAdminUser from './pages/setup/CreateAdminUser';

export default function FrontDesk({ adminUserInitialized }) {
  // Display a loading spinner while waiting for authentication status from the server.
  const { isFetched, data, error } = useGetMe();
  const theme = useTheme();

  if (isFetched && !adminUserInitialized) return <CreateAdminUser />;
  if (data)
  {
    /* Disable email verification site in development mode.
    Also explicitly checking is_email_confirmed for "false"
    to be safer about locking users out of their accounts
    in case the property isn't present for some reason. */
    const emailNeedsVerification = data?.is_email_confirmed === false;
    // const emailNeedsVerification = !__DEV__ && data?.is_email_confirmed === false;
    return <AuthenticatedSwitch emailNeedsVerification={emailNeedsVerification} />;
  }
  if (error) return <UnauthenticatedSwitch />;

  return (
    <Backdrop style={{ color: theme.palette.common.white }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
