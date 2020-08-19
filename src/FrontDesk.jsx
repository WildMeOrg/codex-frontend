import React from 'react';
import { useLocation } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import BigSwitch from './BigSwitch';
import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import Splash from './pages/splash/Splash';
import useGetMe from './models/users/useGetMe';

export default function FrontDesk() {
  /* Root logic for mounting the correct component based on route and authentication status.
     - If route is "/" go to splash page for unauthenciated users and the home page for
     authenticated users.
     - If the route is anything else, go to the log in page for unauthenticated users, otherwise
     use BigSwitch.
     - Display a loading spinner while waiting for authentication status from the server.
  */
  const { data, error } = useGetMe();
  const { pathname } = useLocation();

  if (data) return <BigSwitch />;
  if (error && pathname === '/') return <Splash />;
  if (error) {
    if (pathname === '/login') return <Login redirect="/" />;
    if (pathname === '/logout') return <Logout />;
    return <Login showBanner redirect={pathname} />;
  }

  return (
    <Backdrop style={{ color: 'white' }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
