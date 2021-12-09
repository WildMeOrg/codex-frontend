import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import SightingIcon from '@material-ui/icons/PhotoCamera';

import BannerLogo from './BannerLogo';
import Link from './Link';
import IndividualIcon from './icons/IndividualIcon';

const Entry = function({ messageId, Icon, disabled, ...rest }) {
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
};

export default function AppDrawer({ open, onClose, handleClick }) {
  return (
    <Drawer open={open} onClose={onClose}>
      <div style={{ width: 300 }}>
        <List style={{ margin: '8px 0 0 4px' }}>
          <BannerLogo black href="/" onClick={handleClick} />
          <Divider style={{ marginTop: 12, marginBottom: 12 }} />
          <Entry
            messageId="REPORT_SIGHTINGS"
            Icon={AddToPhotosIcon}
            href="/report"
            onClick={handleClick}
          />
          <Entry
            messageId="EXPLORE_SIGHTINGS_CAPITALIZED"
            Icon={SightingIcon}
            href="/sightings"
            onClick={handleClick}
          />
          <Entry
            messageId="EXPLORE_INDIVIDUALS_CAPITALIZED"
            Icon={IndividualIcon}
            href="/individuals"
            onClick={handleClick}
          />
        </List>
      </div>
    </Drawer>
  );
}
