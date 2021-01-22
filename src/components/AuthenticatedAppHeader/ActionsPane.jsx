import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Divider from '@material-ui/core/Divider';
import SettingsIcon from '@material-ui/icons/Settings';
import SiteConfigIcon from '@material-ui/icons/PermDataSetting';
import AdministrationIcon from '@material-ui/icons/Gavel';
import ServerStatusIcon from '@material-ui/icons/Dns';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import Link from '../Link';
import shane from '../../assets/shane.jpg';

const actions = [
  {
    id: 'settings',
    href: '/settings',
    adminOnly: true,
    messageId: 'SETTINGS_AND_PRIVACY',
    icon: SettingsIcon,
  },
  {
    id: 'site-config',
    href: '/admin/settings',
    adminOnly: true,
    messageId: 'SITE_SETTINGS',
    icon: SiteConfigIcon,
  },
  {
    id: 'server-status',
    href: '/admin/server',
    adminOnly: true,
    messageId: 'SERVER_STATUS',
    icon: ServerStatusIcon,
  },
  {
    id: 'administration',
    href: '/admin/actions',
    adminOnly: true,
    messageId: 'ADMINISTRATIVE_ACTIONS',
    icon: AdministrationIcon,
  },
];

export default function NotificationsPane({
  anchorEl,
  setAnchorEl,
  isAdministrator,
}) {
  const intl = useIntl();
  const theme = useTheme();
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
      onClose={() => setAnchorEl(null)}
    >
      <MenuList style={{ minWidth: 270 }}>
        <Link href="/" noUnderline>
          <MenuItem style={{ minHeight: 'auto' }}>
            <Avatar style={{ height: 52, width: 52 }} src={shane} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                style={{ margin: '0 20px', fontWeight: 'bold' }}
              >
                Bob Dakota
              </Typography>
              <Typography
                variant="body2"
                style={{ margin: '0 20px' }}
              >
                <FormattedMessage id="VIEW_PROFILE" />
              </Typography>
            </div>
          </MenuItem>
        </Link>
        <Divider style={{ margin: '8px 16px' }} />
        {actions.map(action => {
          if (action.adminOnly && !isAdministrator) return null;
          return (
            <Link key={action.id} href={action.href} noUnderline>
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
                <Typography style={{ margin: '0 8px' }}>
                  <FormattedMessage id={action.messageId} />
                </Typography>
              </MenuItem>
            </Link>
          );
        })}
        <Divider style={{ margin: '8px 16px' }} />
        <MenuItem>
          <form
            action={`${__houston_url__}/logout?next=/`}
            method="POST"
            style={{ display: 'flex', alignItems: 'center' }}
          >
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
            <Typography style={{ margin: '0 8px 0 4px' }}>
              <input
                style={{
                  cursor: 'pointer',
                  border: 'unset',
                  background: 'unset',
                  fontWeight: 'unset',
                  color: theme.palette.common.black,
                }}
                type="submit"
                value={intl.formatMessage({ id: 'LOG_OUT' })}
              />
            </Typography>
          </form>
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
