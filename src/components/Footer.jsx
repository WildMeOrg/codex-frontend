import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Button from './Button';
import Link from './Link';
import footerMenuSchema from '../constants/footerMenu';

function Menu({ labelId, schema, themeColor }) {
  return (
    <MenuList style={{ margin: '0 20px' }}>
      <MenuItem>
        <Typography variant="subtitle2" style={{ color: themeColor }}>
          <FormattedMessage id={labelId} />
        </Typography>
      </MenuItem>
      {schema.map(item => (
        <MenuItem key={item.id}>
          <Link noUnderline href={item.href} external={item.external}>
            <Typography>
              <FormattedMessage id={item.id} />
            </Typography>
          </Link>
        </MenuItem>
      ))}
    </MenuList>
  );
}

export default function Footer({ authenticated = false }) {
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px 20px 12px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h6" style={{ color: 'white' }}>
          Wild Me for Whale Sharks
        </Typography>
        <Button display="primary">
          <FormattedMessage id="COMMUNITY_FORUMS" />
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '8px 0 24px 0',
        }}
      >
        <Menu
          labelId="ACCOUNT"
          themeColor={themeColor}
          schema={
            authenticated
              ? footerMenuSchema.accountAuthenticated
              : footerMenuSchema.accountUnauthenticated
          }
        />
        <Menu
          labelId="RESOURCES"
          themeColor={themeColor}
          schema={footerMenuSchema.resources}
        />
        <Menu
          labelId="CONTRIBUTE"
          themeColor={themeColor}
          schema={footerMenuSchema.contribute}
        />
        <Menu
          labelId="SOCIAL"
          themeColor={themeColor}
          schema={footerMenuSchema.social}
        />
      </div>
      <div
        style={{
          width: '100%',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption">
          <FormattedMessage id="COPYRIGHT_LINE" />
        </Typography>
      </div>
    </div>
  );
}
