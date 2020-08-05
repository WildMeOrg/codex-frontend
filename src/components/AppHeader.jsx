import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuIcon from '@material-ui/icons/Menu';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';

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

const popoverId = 'popover';
const exploreSpanId = 'explore';

export default function AppHeader() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdministrator = useSelector(selectIsAdministrator);
  const logos = useSelector(selectLogos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [exploreOpen, setExploreOpen] = React.useState(false);

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
      {isXs && (
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
        {isXs && (
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
        {!isXs && (
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
                <span id={exploreSpanId} style={{ letterSpacing: 0 }}>
                  <FormattedMessage id="EXPLORE" />
                </span>
                <DropDownIcon />
              </Button>
              <ClickAwayListener
                mouseEvent="onMouseDown"
                onClickAway={event => {
                  if (event.target.id !== exploreSpanId)
                    setExploreOpen(false);
                }}
              >
                <HeaderMenu open={exploreOpen} itemCount={4}>
                  <MenuList
                    onClick={() => {
                      if (exploreOpen) setExploreOpen(false);
                    }}
                  >
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
              </ClickAwayListener>
            </div>
            <Typography>
              <Link
                noUnderline
                href="https://community.wildbook.org/"
                external
              >
                <FormattedMessage id="HELP" />
              </Link>
            </Typography>
            <Typography>
              <Link
                noUnderline
                href="http://wiki.wildbook.org/"
                external
              >
                <FormattedMessage id="DOCS" />
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
        {isAuthenticated ? (
          <>
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
                onClick={e => {
                  setAnchorEl(e.currentTarget);
                }}
                src={shane}
              />
              <DropDownIcon style={{ cursor: 'pointer' }} />
              <HeaderMenu
                open
                itemCount={2}
                style={{ right: -8, marginTop: 12 }}
              >
                <MenuList>
                  <Link href="/" noUnderline>
                    <MenuItem className="dark-menu-item">
                      <Typography style={{ margin: '0 20px' }}>
                        <FormattedMessage id="VIEW_PROFILE" />
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Link href="/logout" noUnderline>
                    <MenuItem className="dark-menu-item">
                      <Typography style={{ margin: '0 20px' }}>
                        <FormattedMessage id="LOG_OUT" />
                      </Typography>
                    </MenuItem>
                  </Link>
                </MenuList>
              </HeaderMenu>
            </div>
          </>
        ) : (
          <ButtonLink
            size={isXs ? 'small' : undefined}
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
