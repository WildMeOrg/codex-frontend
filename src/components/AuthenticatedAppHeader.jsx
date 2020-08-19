import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuIcon from '@material-ui/icons/Menu';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';
import LeavingIcon from '@material-ui/icons/ExitToApp';

import { selectLogos } from '../modules/site/selectors';
import {
  selectIsAuthenticated,
  selectIsAdministrator,
} from '../modules/app/selectors';
import { setLoginRedirect } from '../modules/app/actions';
// import useSiteSettings from '../models/site/useSiteSettings';
import ButtonLink from './ButtonLink';
import Button from './Button';
import Link from './Link';
import AppDrawer from './AppDrawer';
import HeaderMenu from './HeaderMenu';
import shane from '../assets/shane.jpg';

export default function AppHeader() {
  const theme = useTheme();
  const intl = useIntl();
  const location = useLocation();
  const dispatch = useDispatch();

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdministrator = useSelector(selectIsAdministrator);
  const logos = useSelector(selectLogos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // const siteSettings = useSiteSettings();

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
      {(exploreOpen || userMenuOpen) && (
        <ClickAwayListener
          onClickAway={() => {
            setExploreOpen(false);
            setUserMenuOpen(false);
          }}
        >
          <div />
        </ClickAwayListener>
      )}
      {isSm && (
        <AppDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          handleClick={handleClick}
          isAuthenticated={isAuthenticated}
        />
      )}
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {isSm && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          style={{ fontSize: 20 }}
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
        {!isSm && (
          <>
            <Typography>
              <Link noUnderline href="/report">
                <FormattedMessage id="REPORT_SIGHTINGS" />
              </Link>
            </Typography>
            <div>
              <Button
                style={{
                  textTransform: 'unset',
                  color: 'white',
                  fontWeight: 300,
                  fontSize: 16,
                  letterSpacing: 0,
                }}
                onClick={() => setExploreOpen(!exploreOpen)}
              >
                <span style={{ letterSpacing: 0 }}>
                  <FormattedMessage id="EXPLORE" />
                </span>
                <DropDownIcon />
              </Button>
              <HeaderMenu open={exploreOpen} itemCount={4}>
                <MenuList onClick={() => setExploreOpen(false)}>
                  <Link noUnderline href="/sightings">
                    <MenuItem className="dark-menu-item">
                      <Typography>
                        <FormattedMessage id="SIGHTINGS" />
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Link noUnderline href="/individuals">
                    <MenuItem className="dark-menu-item">
                      <Typography>
                        <FormattedMessage id="INDIVIDUALS" />
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Link noUnderline href="/users">
                    <MenuItem className="dark-menu-item">
                      <Typography>
                        <FormattedMessage id="USERS" />
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Link noUnderline href="/orgs">
                    <MenuItem className="dark-menu-item">
                      <Typography>
                        <FormattedMessage id="ORGANIZATIONS" />
                      </Typography>
                    </MenuItem>
                  </Link>
                </MenuList>
              </HeaderMenu>
            </div>
            <Typography>
              <Link
                noUnderline
                href="https://community.wildbook.org/"
                external
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <FormattedMessage id="HELP" />
                <LeavingIcon
                  style={{ marginLeft: 8 }}
                  fontSize="small"
                />
              </Link>
            </Typography>
            <Typography>
              <Link
                noUnderline
                href="http://wiki.wildbook.org/"
                external
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <FormattedMessage id="DOCS" />
                <LeavingIcon
                  style={{ marginLeft: 8 }}
                  fontSize="small"
                />
              </Link>
            </Typography>
            {isAdministrator && (
              <Typography>
                <Link noUnderline href="/administration">
                  <FormattedMessage id="ADMIN" />
                </Link>
              </Typography>
            )}
          </>
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            style={{
              marginLeft: 8,
              cursor: 'pointer',
            }}
            onClick={() => setUserMenuOpen(true)}
            src={shane}
          />
          <DropDownIcon
            onClick={() => setUserMenuOpen(true)}
            style={{ cursor: 'pointer' }}
          />
          <HeaderMenu
            open={userMenuOpen}
            itemCount={2}
            style={{ right: -8, marginTop: isXs ? 8 : 12 }}
          >
            <MenuList>
              <Link href="/" noUnderline>
                <MenuItem
                  style={{ minHeight: 'auto' }}
                  className="dark-menu-item"
                >
                  <Typography style={{ margin: '0 20px' }}>
                    <FormattedMessage id="VIEW_PROFILE" />
                  </Typography>
                </MenuItem>
              </Link>
              <form
                action="http://localhost:5000/logout?next=/"
                method="POST"
              >
                <Typography style={{ margin: '6px 20px 6px 30px' }}>
                  <input
                    style={{
                      cursor: 'pointer',
                      color: 'white',
                      border: 'unset',
                      background: 'unset',
                      fontWeight: 'unset',
                    }}
                    type="submit"
                    value={intl.formatMessage({ id: 'LOG_OUT' })}
                  />
                </Typography>
              </form>
              <Link href="/logout" noUnderline>
                <MenuItem
                  style={{ minHeight: 'auto' }}
                  className="dark-menu-item"
                >
                  <Typography style={{ margin: '0 20px' }}>
                    <FormattedMessage id="LOG_OUT" />
                  </Typography>
                </MenuItem>
              </Link>
            </MenuList>
          </HeaderMenu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
