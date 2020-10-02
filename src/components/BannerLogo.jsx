import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InlineButton from './InlineButton';
import Link from './Link';
import useSiteSettings from '../models/site/useSiteSettings';

export default function BannerLogo({ href, onClick, ...rest }) {
  const { data: newSiteSettings, loading, error } = useSiteSettings();
  const theme = useTheme();

  let Container = 'div';
  if (onClick) Container = InlineButton;
  if (href) Container = Link;

  const noUnderline = href || onClick ? true : undefined;
  const siteName = get(newSiteSettings, ['site.name', 'value'], '');

  if (loading || error) return null;

  return (
    <Container
      href={href}
      onClick={onClick}
      noUnderline={noUnderline}
      {...rest}
    >
      <Typography
        variant="h4"
        style={{ color: theme.palette.common.white, marginRight: 12 }}
      >
        {siteName}
      </Typography>
    </Container>
  );
}
