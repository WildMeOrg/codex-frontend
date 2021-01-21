import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Link from '../Link';

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
      <MenuList>
        <Link href="/" noUnderline>
          <MenuItem style={{ minHeight: 'auto' }}>
            <Typography style={{ margin: '0 20px' }}>
              <FormattedMessage id="VIEW_PROFILE" />
            </Typography>
          </MenuItem>
        </Link>
        {isAdministrator && (
          <Link href="/admin/settings" noUnderline>
            <MenuItem style={{ minHeight: 'auto' }}>
              <Typography style={{ margin: '0 20px' }}>
                <FormattedMessage id="SITE_SETTINGS" />
              </Typography>
            </MenuItem>
          </Link>
        )}
        {isAdministrator && (
          <Link href="/admin/server" noUnderline>
            <MenuItem style={{ minHeight: 'auto' }}>
              <Typography style={{ margin: '0 20px' }}>
                <FormattedMessage id="SERVER_STATUS" />
              </Typography>
            </MenuItem>
          </Link>
        )}
        {isAdministrator && (
          <Link href="/admin/actions" noUnderline>
            <MenuItem style={{ minHeight: 'auto' }}>
              <Typography style={{ margin: '0 20px' }}>
                <FormattedMessage id="ADMINISTRATIVE_ACTIONS" />
              </Typography>
            </MenuItem>
          </Link>
        )}
        <form
          action={`${__houston_url__}/logout?next=/`}
          method="POST"
        >
          <Typography style={{ margin: '6px 20px 6px 30px' }}>
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
      </MenuList>
    </Popover>
  );
}
