import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../modules/app/selectors';
import Home from './home/Home';
import Splash from './splash/Splash';

export default function Root() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) return <Home />;
  return <Splash />;
}
