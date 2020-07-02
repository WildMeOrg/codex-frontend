import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';

import { selectLogos } from '../modules/site/selectors';
import { selectIsAuthenticated } from '../modules/app/selectors';
import { setLoginRedirect } from '../modules/app/actions';
import ButtonLink from './ButtonLink';
import Link from './Link';
import AppDrawer from './AppDrawer';
import shane from '../assets/shane.jpg';

const popoverId = 'popover';

export default function AppHeader() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const logos = useSelector(selectLogos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = () => {
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      style={{
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        handleClick={handleClick}
        isAuthenticated={isAuthenticated}
      />
      <Toolbar
        style={{
          paddingRight: 24,
          width: '90%',
          margin: '0 auto',
        }}
      >
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
          <>
            <Avatar
              style={{
                marginLeft: theme.spacing(1),
              }}
              onClick={e => {
                setAnchorEl(e.currentTarget);
              }}
              src={shane}
            />
            <Popover
              id={popoverId}
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              style={{ marginTop: 8 }}
            >
              <div style={{ padding: '12px 0' }}>
                <Link href="/" noUnderline>
                  <Typography style={{ margin: '0 20px' }}>
                    View profile
                  </Typography>
                </Link>
                <Divider style={{ margin: '12px 0' }} />
                <Link href="/logout" noUnderline>
                  <Typography style={{ margin: '0 20px' }}>
                    Log out
                  </Typography>
                </Link>
              </div>
            </Popover>
          </>
        ) : (
          <ButtonLink
            display="primary"
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
