import React, { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

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
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import AndroidIcon from '@material-ui/icons/Android';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import AdminSettingsIcon from '@material-ui/icons/PermDataSetting';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import SubjectIcon from '@material-ui/icons/Subject';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';

import { setLocale } from '../modules/app/actions';
import { selectLogos } from '../modules/site/selectors';

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
  const dispatch = useDispatch();

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
                marginTop: 10,
                marginBottom: 20,
                marginLeft: 16,
              }}
            >
              <Link
                to="/"
                style={{ textDecoration: 'none', color: 'unset' }}
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
                  to="/report"
                  style={{ textDecoration: 'none', color: 'unset' }}
                >
                  <FormattedMessage id="REPORT_ENCOUNTERS" />
                </Link>
              </ListItemText>
            </ListItem>
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <ListItem>
              <ListItemIcon>
                <PhotoCameraIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage
                  id="ENCOUNTERS"
                  defaultMessage="Encounters"
                />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AndroidIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage
                  id="INDIVIDUALS"
                  defaultMessage="Individuals"
                />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage id="USERS" defaultMessage="Users" />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText>
                <FormattedMessage
                  id="ORGANIZATIONS"
                  defaultMessage="Organizations"
                />
              </ListItemText>
            </ListItem>
            <Divider style={{ marginTop: 12, marginBottom: 12 }} />
            <ListItem>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText>
                <a
                  href="https://community.wildbook.org/"
                  style={{ textDecoration: 'none', color: 'unset' }}
                >
                  <FormattedMessage
                    id="HELP_AND_FEEDBACK"
                    defaultMessage="Help & Feedback"
                  />
                </a>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SubjectIcon />
              </ListItemIcon>
              <ListItemText>
                <a
                  href="http://wiki.wildbook.org/"
                  style={{ textDecoration: 'none', color: 'unset' }}
                >
                  <FormattedMessage
                    id="DOCS"
                    defaultMessage="Documentation"
                  />
                </a>
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
          <Link to="/" style={{ display: 'flex' }}>
            <img
              src={logos.white}
              style={{ height: 36 }}
              alt="Site logo"
            />
          </Link>
        </Typography>
        <Button
          style={{ color: 'white', textTransform: 'unset' }}
          onClick={() => dispatch(setLocale('en'))}
        >
          English
        </Button>
        <Button
          style={{ color: 'white', textTransform: 'unset' }}
          onClick={() => dispatch(setLocale('es'))}
        >
          Español
        </Button>
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
