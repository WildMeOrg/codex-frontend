import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import AdminSettingsIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import SubjectIcon from '@material-ui/icons/Subject';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SightingIcon from '@material-ui/icons/PhotoCamera';

import { selectLogos } from '../modules/site/selectors';
import Link from './Link';
import IndividualIcon from './icons/IndividualIcon';

function Entry({ messageId, Icon, disabled, ...rest }) {
  const theme = useTheme();

  return (
    <ListItem style={{ marginLeft: 8 }}>
      <Link noUnderline disabled={disabled} {...rest}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ListItemIcon
            style={{
              minWidth: 36,
              color: disabled
                ? theme.palette.action.disabled
                : theme.palette.action.active,
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id={messageId} />
          </ListItemText>
        </div>
      </Link>
    </ListItem>
  );
}

export default function AppDrawer({
  open,
  onClose,
  handleClick,
  isAdministrator,
}) {
  const logos = useSelector(selectLogos);

  return (
    <Drawer open={open} onClose={onClose}>
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
            <Link noUnderline href="/" onClick={handleClick}>
              <img
                src={logos.black}
                style={{ height: 40 }}
                alt="Site logo"
              />
            </Link>
          </Typography>
          <Divider style={{ marginTop: 12, marginBottom: 12 }} />
          <Entry
            messageId="REPORT_SIGHTINGS"
            Icon={AddToPhotosIcon}
            href="/report"
            onClick={handleClick}
          />
          <Divider style={{ marginTop: 12, marginBottom: 12 }} />
          <Entry
            messageId="SIGHTINGS"
            Icon={SightingIcon}
            href="/sightings"
            onClick={handleClick}
          />
          <Entry
            messageId="INDIVIDUALS"
            Icon={IndividualIcon}
            href="/individuals"
            onClick={handleClick}
          />
          <Entry
            messageId="USERS"
            Icon={PersonIcon}
            href="/users"
            onClick={handleClick}
          />
          <Entry
            messageId="ORGANIZATIONS"
            Icon={GroupIcon}
            href="/orgs"
            onClick={handleClick}
          />
          {isAdministrator && (
            <>
              <Divider style={{ marginTop: 12, marginBottom: 12 }} />
              <Entry
                messageId="ADMINISTRATION"
                Icon={AdminSettingsIcon}
                href="/administration"
                onClick={handleClick}
              />
            </>
          )}
          <Divider style={{ marginTop: 12, marginBottom: 12 }} />
          <Entry
            messageId="HELP_AND_FEEDBACK"
            Icon={HelpOutlineIcon}
            href="https://community.wildbook.org/"
            external
          />
          <Entry
            messageId="DOCUMENTATION"
            Icon={SubjectIcon}
            href="http://wiki.wildbook.org/"
            external
          />
        </List>
      </div>
    </Drawer>
  );
}
