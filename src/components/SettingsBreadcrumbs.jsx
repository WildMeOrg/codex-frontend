import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import Link from './Link';
import Text from './Text';

export default function SettingsBreadcrumbs({
  currentPageText,
  currentPageTextId,
}) {
  const theme = useTheme();

  const linkStyles = {
    color: theme.palette.text.secondary,
  };
  return (
    <Breadcrumbs
      style={{ margin: '8px 0 0 20px' }}
      aria-label="breadcrumb"
    >
      <Link href="/" style={linkStyles}>
        <Text id="HOME" />
      </Link>
      <Link href="/settings" style={linkStyles}>
        <Text id="CONTROL_PANEL" />
      </Link>
      {['MANAGE_SPECIES', 'MANAGE_REGIONS'].includes(
        currentPageTextId,
      ) && (
        <Link href="/settings/fields" style={linkStyles}>
          <Text id="MANAGE_FIELDS" />
        </Link>
      )}
      <Text id={currentPageTextId}>{currentPageText}</Text>
    </Breadcrumbs>
  );
}
