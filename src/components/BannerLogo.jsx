import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InlineButton from './InlineButton';
import Link from './Link';
import InstanceLogo from './svg/InstanceLogo';
import useSiteSettings from '../models/site/useSiteSettings';

export default function BannerLogo({ href, onClick, ...rest }) {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const theme = useTheme();

  let Container = 'div';
  if (onClick) Container = InlineButton;
  if (href) Container = Link;

  const containerProps = href || onClick ? { noUnderline: true } : {};

  const siteName = get(siteSettings, ['site.name', 'value'], '');

  if (loading || error) return null;

  return (
    <Container
      href={href}
      onClick={onClick}
      {...containerProps}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <InstanceLogo
          style={{ fill: theme.palette.primary.main, height: 52 }}
        />
        <Typography
          variant="h5"
          style={{
            color: theme.palette.common.white,
            margin: '0 12px 0 4px',
          }}
        >
          {siteName}
        </Typography>
      </div>
    </Container>
  );
}
