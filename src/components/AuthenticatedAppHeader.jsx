import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { get } from 'lodash-es';

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

import { selectLogos } from '../modules/site/selectors';
// import useSiteSettings from '../models/site/useSiteSettings';
import Link from './Link';
import AppDrawer from './AppDrawer';
import HeaderMenu from './HeaderMenu';
import useGetMe from '../models/users/useGetMe';
import shane from '../assets/shane.jpg';
import { houstonUrl } from '../constants/urls';

export default function AppHeader() {
  const theme = useTheme();
  const intl = useIntl();
  const { data: meData } = useGetMe();
  const isAdministrator = get(meData, 'is_admin', false);

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));

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
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
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
          isAdministrator={isAdministrator}
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

            <Typography>
              <Link noUnderline href="/individuals">
                <FormattedMessage id="INDIVIDUALS" />
              </Link>
            </Typography>

            <Typography>
              <Link noUnderline href="/sightings">
                <FormattedMessage id="SIGHTINGS" />
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
                  <Typography
                    style={{ margin: '0 20px', color: 'white' }}
                  >
                    <FormattedMessage id="VIEW_PROFILE" />
                  </Typography>
                </MenuItem>
              </Link>
              <form
                action={`${houstonUrl}/logout?next=/`}
                method="POST"
              >
                <Typography style={{ margin: '6px 20px 6px 30px' }}>
                  <input
                    style={{
                      cursor: 'pointer',
                      border: 'unset',
                      background: 'unset',
                      fontWeight: 'unset',
                      color: 'white',
                    }}
                    type="submit"
                    value={intl.formatMessage({ id: 'LOG_OUT' })}
                  />
                </Typography>
              </form>
            </MenuList>
          </HeaderMenu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
