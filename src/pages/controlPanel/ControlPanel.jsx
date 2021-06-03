import React, { useState } from 'react';
import { useTheme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SplashSettingsIcon from '@material-ui/icons/Home';
import SiteSettingsIcon from '@material-ui/icons/Settings';
import CustomFieldsIcon from '@material-ui/icons/Tune';
import SiteStatusIcon from '@material-ui/icons/Speed';
import UserManagementIcon from '@material-ui/icons/People';
import AdministrationIcon from '@material-ui/icons/Gavel';

import MainColumn from '../../components/MainColumn';
import Link from '../../components/Link';
import Text from '../../components/Text';

const adminPages = [
  {
    icon: SiteSettingsIcon,
    name: 'general_settings',
    labelId: 'GENERAL_SETTINGS',
    href: '/admin/settings',
  },
  {
    icon: SplashSettingsIcon,
    name: 'splash-config',
    labelId: 'SPLASH_PAGE',
    href: '/admin/splash',
  },
  {
    icon: CustomFieldsIcon,
    name: 'field-management',
    labelId: 'MANAGE_FIELDS',
    href: '/admin/fields',
  },
  {
    icon: SiteStatusIcon,
    name: 'site-status',
    labelId: 'SITE_STATUS',
    href: '/admin/status',
  },
  {
    icon: UserManagementIcon,
    name: 'user-management',
    labelId: 'MANAGE_USERS',
    href: '/admin/users',
  },
  {
    icon: AdministrationIcon,
    name: 'admin-actions',
    labelId: 'ADMINISTRATOR_ACTIONS',
    href: '/admin/actions',
  },
];

export default function ControlPanel() {
  const theme = useTheme();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <MainColumn>
      <Text variant="h3" id="CONTROL_PANEL" style={{ padding: 20 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {adminPages.map(page => {
          const hovered = hoveredCard === page.name;
          return (
            <Link
              key={page.name}
              to={page.href}
              onMouseEnter={() => setHoveredCard(page.name)}
              onMouseLeave={() => setHoveredCard(null)}
              noUnderline
            >
              <Paper
                style={{
                  width: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '32px 16px',
                  cursor: 'pointer',
                  margin: 12,
                  height: 160,
                }}
                elevation={hovered ? 10 : undefined}
              >
                <page.icon
                  style={{
                    fontSize: 60,
                    fill: hovered
                      ? theme.palette.primary.light
                      : undefined,
                  }}
                />
                <Text
                  variant="h6"
                  style={{ marginTop: 16 }}
                  id={page.labelId}
                />
              </Paper>
            </Link>
          );
        })}
      </div>
    </MainColumn>
  );
}
