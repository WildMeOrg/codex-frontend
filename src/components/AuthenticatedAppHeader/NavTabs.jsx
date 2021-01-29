import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, Link as RouterLink } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import ProjectsIcon from '@material-ui/icons/GroupWork';
import SightingsIcon from '@material-ui/icons/PhotoCamera';

import IndividualIcon from '../icons/IndividualIcon';

function getTabValueFromLocation(location) {
  if (!location) return false;
  if (location.pathname === '/') return 'home';
  if (location.pathname.includes('/individuals'))
    return 'individuals';
  if (location.pathname.includes('/sightings')) return 'sightings';
  if (location.pathname.includes('/projects')) return 'projects';
  return false;
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
      <NavTab
        titleId="PROJECTS"
        href="/projects"
        Icon={ProjectsIcon}
        value="projects"
      />
    </Tabs>
  );
}
