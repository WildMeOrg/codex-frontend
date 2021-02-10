import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import HomeIcon from '@material-ui/icons/Home';
import ProjectsIcon from '@material-ui/icons/GroupWork';
import SightingsIcon from '@material-ui/icons/PhotoCamera';

import IndividualIcon from '../icons/IndividualIcon';
import Button from '../Button';
import Text from '../Text';
import Link from '../Link';
import fakeProjects from './fakeProjects';

function getTabValueFromLocation(location) {
  if (!location) return false;
  if (location.pathname === '/') return 'home';
  if (location.pathname.includes('/individuals'))
    return 'individuals';
  if (location.pathname.includes('/sightings')) return 'sightings';
  if (location.pathname.includes('/projects')) return 'projects';
  return false;
}

function NavButton({ titleId, href }) {
  const intl = useIntl();
  const theme = useTheme();
  const title = intl.formatMessage({ id: titleId });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedProject, setSelectedProject] = React.useState('abc');

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        display="basic"
        onClick={handleClick}
        style={{ color: theme.palette.common.white }}
      >
        {title}
      </Button>
      <Popover
        onClose={handleClose}
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            width: 300,
            padding: '20px 20px 8px 20px',
          },
        }}
      >
        <Text style={{ marginBottom: 4 }}>Current project</Text>
        <List
          dense
          style={{ width: 260, height: 210, overflow: 'scroll' }}
        >
          {fakeProjects.map(project => {
            const selected = selectedProject === project.id;
            return (
              <ListItem
                style={{
                  background: selected
                    ? theme.palette.grey['300']
                    : theme.palette.grey['100'],
                }}
              >
                <ListItemAvatar>
                  <Avatar variant="square">A</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Link href={href}>{project.name}</Link>}
                  secondary={
                    <Text variant="caption">{project.pid}</Text>
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    onChange={() => setSelectedProject(project.id)}
                    checked={selected}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        <Button display="primary" style={{ margin: '12px 0' }}>
          <FormattedMessage id="CREATE_A_PROJECT" />
        </Button>
      </Popover>
    </div>
  );
}

function NavTab({ titleId, href, Icon }) {
  const intl = useIntl();
  const title = intl.formatMessage({ id: titleId });
  return (
    <Tab
      component={RouterLink}
      to={href}
      style={{ minWidth: 52 }}
      aria-label={title}
      label={title}
      icon={<Icon />}
    />
  );
}

export default function NavTabs() {
  const location = useLocation();
  return (
    <Tabs value={getTabValueFromLocation(location)}>
      <NavTab titleId="HOME" href="/" Icon={HomeIcon} value="home" />
      <NavTab
        titleId="INDIVIDUALS"
        href="/individuals"
        Icon={IndividualIcon}
        value="individuals"
      />
      <NavTab
        titleId="SIGHTINGS"
        href="/sightings"
        Icon={SightingsIcon}
        value="sightings"
      />
      <NavButton
        titleId="PROJECTS"
        href="/projects"
        Icon={ProjectsIcon}
        value="projects"
      />
    </Tabs>
  );
}
