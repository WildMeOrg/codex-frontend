import React, { useState } from 'react';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';

import { selectLogos } from '../modules/site/selectors';
import { selectIsAuthenticated } from '../modules/app/selectors';
import { setLoginRedirect } from '../modules/app/actions';
import ButtonLink from './ButtonLink';
import Link from './Link';
import AppDrawer from './AppDrawer';

const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
    fontSize: 50,
  },

  avatar: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

export default function AppHeader() {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const logos = useSelector(selectLogos);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClick = () => {
    window.scrollTo(0, 0);
    setDrawerOpen(false);
  };

  return (
    <AppBar position="fixed" className={clsx(classes.appBar)}>
      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        handleClick={handleClick}
        isAuthenticated={isAuthenticated}
      />
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          style={{ marginRight: 8 }}
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          style={{ fontSize: 20, flexGrow: 1 }}
        >
          <Link
            href="/"
            noUnderline
            style={{ display: 'flex' }}
            onClick={handleClick}
          >
            <img
              src={logos.white}
              style={{ height: 30 }}
              alt="Site logo"
            />
          </Link>
        </Typography>
        {isAuthenticated ? (
          <Avatar className={classes.avatar} variant="square">
            1
          </Avatar>
        ) : (
          <ButtonLink
            style={{ color: theme.palette.common.white }}
            href="/login"
            onClick={() => {
              dispatch(setLoginRedirect(location.pathname));
            }}
          >
            <FormattedMessage id="LOG_IN" />
          </ButtonLink>
        )}
      </Toolbar>
    </AppBar>
  );
}
