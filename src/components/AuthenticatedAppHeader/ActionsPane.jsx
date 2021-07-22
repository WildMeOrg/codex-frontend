import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import SettingsIcon from '@material-ui/icons/Settings';
import ControlPanelIcon from '@material-ui/icons/PermDataSetting';
import BulkImportIcon from '@material-ui/icons/PostAdd';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import Link from '../Link';
import Text from '../Text';
import shane from '../../assets/shane.jpg';

const actions = [
  {
    id: 'bulk-import',
    href: '/bulk-import',
    messageId: 'BULK_IMPORT',
    icon: BulkImportIcon,
  },
  {
    id: 'settings',
    href: '/settings',
    messageId: 'SETTINGS_AND_PRIVACY',
    icon: SettingsIcon,
  },
  {
    id: 'control-panel',
    href: '/admin',
    adminOrUserManagerOnly: true,
    messageId: 'CONTROL_PANEL',
    icon: ControlPanelIcon,
  },
];

export default function NotificationsPane({
  anchorEl,
  setAnchorEl,
  isAdministrator,
  isUserManager,
}) {
  const theme = useTheme();
  const closePopover = () => setAnchorEl(null);
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      PaperProps={{ style: { marginTop: -8 } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorEl={anchorEl}
      onClose={closePopover}
    >
      <MenuList style={{ minWidth: 270 }}>
        <Link href="/" onClick={closePopover} noUnderline>
          <MenuItem style={{ minHeight: 'auto' }}>
            <Avatar style={{ height: 52, width: 52 }} src={shane} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={{ margin: '0 20px', fontWeight: 'bold' }}>
                Bob Dakota
              </Text>
              <Text
                variant="body2"
                style={{ margin: '0 20px' }}
                id="VIEW_PROFILE"
              />
            </div>
          </MenuItem>
        </Link>
        <Divider style={{ margin: '8px 16px' }} />
        {actions.map(action => {
          const elevatedPermissions =
            isAdministrator || isUserManager;
          if (action.adminOrUserManagerOnly && !elevatedPermissions)
            return null;
          return (
            <Link
              key={action.id}
              href={action.href}
              onClick={closePopover}
              noUnderline
            >
              <MenuItem style={{ minHeight: 'auto' }}>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 1000,
                    backgroundColor: theme.palette.grey.A100,
                    color: theme.palette.grey.A400,
                    lineHeight: 0,
                  }}
                >
                  <action.icon />
                </div>
                <Text
                  style={{ margin: '0 8px' }}
                  id={action.messageId}
                />
              </MenuItem>
            </Link>
          );
        })}
        <Divider style={{ margin: '8px 16px' }} />
        <form
          action={`${__houston_url__}/logout?next=/`}
          method="POST"
        >
          <button
            type="submit"
            onClick={closePopover}
            style={{
              backgroundColor: 'unset',
              width: '100%',
              border: 'unset',
            }}
          >
            <MenuItem style={{ minHeight: 'auto' }}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 1000,
                  backgroundColor: theme.palette.grey.A100,
                  color: theme.palette.grey.A400,
                  lineHeight: 0,
                }}
              >
                <LogoutIcon />
              </div>
              <Text style={{ margin: '0 8px' }} id="LOG_OUT" />
            </MenuItem>
          </button>
        </form>
      </MenuList>
    </Popover>
  );
}
