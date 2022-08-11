import React, { useState } from 'react';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import SplashSettingsIcon from '@material-ui/icons/Home';
import SiteSettingsIcon from '@material-ui/icons/SettingsApplications';
import PreferencesIcon from '@material-ui/icons/Settings';
import CustomFieldsIcon from '@material-ui/icons/Tune';
import SiteStatusIcon from '@material-ui/icons/Speed';
import UserManagementIcon from '@material-ui/icons/People';
import AdministrationIcon from '@material-ui/icons/Gavel';
import GroupWorkIcon from '@material-ui/icons/GroupWork';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useGetMe from '../../models/users/useGetMe';
import MainColumn from '../../components/MainColumn';
import Link from '../../components/Link';
import Text from '../../components/Text';

const adminPages = [
  {
    icon: SiteSettingsIcon,
    name: 'general_settings',
    labelId: 'GENERAL_SETTINGS',
    href: '/settings/general',
    roles: ['is_admin'],
  },
  {
    icon: SplashSettingsIcon,
    name: 'front-page-config',
    labelId: 'FRONT_PAGE',
    href: '/settings/front-page',
    roles: ['is_admin'],
  },
  {
    icon: CustomFieldsIcon,
    name: 'field-management',
    labelId: 'MANAGE_FIELDS',
    href: '/settings/fields',
    roles: ['is_admin'],
  },
  {
    icon: GroupWorkIcon,
    name: 'social-groups',
    labelId: 'SOCIAL_GROUPS',
    href: '/settings/social-groups',
    roles: ['is_admin', 'is_user_manager', 'is_researcher'],
  },
  {
    icon: SiteStatusIcon,
    name: 'site-status',
    labelId: 'SITE_STATUS',
    href: '/settings/status',
    roles: [
      'is_admin',
      'is_user_manager',
      'is_researcher',
      'is_contributor',
    ],
  },
  {
    icon: UserManagementIcon,
    name: 'user-management',
    labelId: 'MANAGE_USERS',
    href: '/settings/users',
    roles: ['is_admin', 'is_user_manager'],
  },
  {
    icon: AdministrationIcon,
    name: 'admin-actions',
    labelId: 'ADMINISTRATOR_ACTIONS',
    href: '/settings/actions',
    roles: ['is_admin'],
  },
  {
    icon: PreferencesIcon,
    name: 'preferences',
    labelId: 'PREFERENCES',
    href: '/settings/preferences',
    roles: [
      'is_admin',
      'is_exporter',
      'is_internal',
      'is_staff',
      'is_user_manager',
      'is_researcher',
      'is_contributor',
    ],
  },
];

export default function ControlPanel() {
  const theme = useTheme();

  useDocumentTitle('CONTROL_PANEL');
  const [hoveredCard, setHoveredCard] = useState(null);

  const { data: userData } = useGetMe();

  return (
    <MainColumn>
      <Text variant="h3" id="CONTROL_PANEL" style={{ padding: 20 }} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {adminPages.map(page => {
          const showButton = page.roles.some(r => get(userData, r));
          if (!showButton) return null;
          const hovered = hoveredCard === page.name;
          const iconFill = hovered
            ? theme.palette.primary.light
            : theme.palette.grey['800'];

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
                    fill: iconFill,
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
