import React, { useState } from 'react';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import AdminSettingsIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import SubjectIcon from '@material-ui/icons/Subject';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SightingIcon from '@material-ui/icons/PhotoCamera';

import SettingsIcon from '@material-ui/icons/Settings';
import { selectLogos } from '../modules/site/selectors';
import Link from './Link';
import IndividualIcon from './icons/IndividualIcon';

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

  const logos = useSelector(selectLogos);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="fixed" className={clsx(classes.appBar)}>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ width: 300 }}>
          <List>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              style={{
                fontSize: 20,
                margin: 20,
              }}
            >
              <Link
                noUnderline
                href="/"
                onClick={() => setDrawerOpen(false)}
              >
                <img
                  src={logos.black}
                  style={{ height: 40 }}
                  alt="Site logo"
                />
              </Link>
            </Typography>
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <ListItem>
              <ListItemIcon>
                <AddToPhotosIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  noUnderline
                  href="/report"
                  onClick={() => setDrawerOpen(false)}
                >
                  <FormattedMessage id="REPORT_SIGHTINGS" />
                </Link>
              </ListItemText>
            </ListItem>
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <ListItem>
              <ListItemIcon>
                <SightingIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href="/sightings"
                  noUnderline
                  onClick={() => setDrawerOpen(false)}
                >
                  <FormattedMessage id="SIGHTINGS" />
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <IndividualIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href="/individuals"
                  noUnderline
                  onClick={() => setDrawerOpen(false)}
                >
                  <FormattedMessage
                    id="INDIVIDUALS"
                    defaultMessage="Individuals"
                  />
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href="/users"
                  noUnderline
                  onClick={() => setDrawerOpen(false)}
                >
                  <FormattedMessage
                    id="USERS"
                    defaultMessage="Users"
                  />
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href="/orgs"
                  noUnderline
                  onClick={() => setDrawerOpen(false)}
                >
                  <FormattedMessage
                    id="ORGANIZATIONS"
                    defaultMessage="Organizations"
                  />
                </Link>
              </ListItemText>
            </ListItem>
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <ListItem>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href="https://community.wildbook.org/"
                  noUnderline
                  external
                >
                  <FormattedMessage
                    id="HELP_AND_FEEDBACK"
                    defaultMessage="Help & Feedback"
                  />
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SubjectIcon />
              </ListItemIcon>
              <ListItemText>
                <Link
                  href="http://wiki.wildbook.org/"
                  noUnderline
                  external
                >
                  <FormattedMessage
                    id="DOCUMENTATION"
                    defaultMessage="Documentation"
                  />
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage
                  id="SETTINGS"
                  defaultMessage="Settings"
                />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AdminSettingsIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage
                  id="ADMINISTRATION"
                  defaultMessage="Administration"
                />
              </ListItemText>
            </ListItem>
          </List>
        </div>
      </Drawer>
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
            onClick={() => setDrawerOpen(false)}
          >
            <img
              src={logos.white}
              style={{ height: 30 }}
              alt="Site logo"
            />
          </Link>
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={3} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Avatar className={classes.avatar} variant="square">
          1
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
