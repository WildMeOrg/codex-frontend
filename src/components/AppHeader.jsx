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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import MenuIcon from '@material-ui/icons/Menu';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';
import { selectLogos } from '../modules/site/selectors';
import { selectIsAuthenticated } from '../modules/app/selectors';
import { setLoginRedirect } from '../modules/app/actions';
// import useSiteSettings from '../models/site/useSiteSettings';
import ButtonLink from './ButtonLink';
import Button from './Button';
import Link from './Link';
import AppDrawer from './AppDrawer';
import shane from '../assets/shane.jpg';

const popoverId = 'popover';

export default function AppHeader() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const isXs = useMediaQuery(theme.breakpoints.only('sm'));

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const logos = useSelector(selectLogos);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [
    exploreAnchorElement,
    setExploreAnchorElement,
  ] = React.useState(null);

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
                onClick={event =>
                  setExploreAnchorElement(event.currentTarget)
                }
              >
                <span style={{ letterSpacing: 0 }}>
                  <FormattedMessage id="EXPLORE" />
                </span>
                <DropDownIcon />
              </Button>
              <Menu
                anchorEl={exploreAnchorElement}
                keepMounted
                open={Boolean(exploreAnchorElement)}
                onClose={() => setExploreAnchorElement(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuList>
                  <MenuItem>
                    <Typography>
                      <Link href="/sightings">
                        <FormattedMessage id="SIGHTINGS" />
                      </Link>
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography>
                      <Link href="/individuals">
                        <FormattedMessage id="INDIVIDUALS" />
                      </Link>
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography>
                      <Link href="/users">
                        <FormattedMessage id="USERS" />
                      </Link>
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography>
                      <Link href="/orgs">
                        <FormattedMessage id="ORGANIZATIONS" />
                      </Link>
                    </Typography>
                  </MenuItem>
                </MenuList>
              </Menu>
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
            <Typography>
              <Link noUnderline href="/administration">
                <FormattedMessage id="ADMIN" />
              </Link>
            </Typography>
          </>
        )}
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
                    <FormattedMessage id="VIEW_PROFILE" />
                  </Typography>
                </Link>
                <Divider style={{ margin: '12px 0' }} />
                <Link href="/logout" noUnderline>
                  <Typography style={{ margin: '0 20px' }}>
                    <FormattedMessage id="LOG_OUT" />
                  </Typography>
                </Link>
              </div>
            </Popover>
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
