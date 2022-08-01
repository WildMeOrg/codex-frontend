import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import InlineButton from './InlineButton';
import Link from './Link';
import InstanceLogo from './svg/InstanceLogo';
import useSiteSettings from '../models/site/useSiteSettings';
import Text from './Text';

export default function BannerLogo({
  href,
  onClick,
  black = false,
  ...rest
}) {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const theme = useTheme();

  let Container = 'div';
  if (onClick) Container = InlineButton;
  if (href) Container = Link;

  const containerProps = href || onClick ? { noUnderline: true } : {};

  if (loading || error) return null;

  const siteName = get(siteSettings, ['site.name', 'value'], '');
  const logo = get(siteSettings, ['site.images', 'logo']);
  const logoIncludesSiteName = get(
    siteSettings,
    ['site.look.logoIncludesSiteName', 'value'],
    false,
  );

  return (
    <Container
      href={href}
      onClick={onClick}
      {...containerProps}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {logo ? (
          <div>
            <img
              alt={`Logo for ${siteName}`}
              src={logo}
              style={{ height: 52, flexShrink: 0 }}
            />
          </div>
        ) : (
          <InstanceLogo
            style={{
              fill: theme.palette.primary.main,
              height: 52,
              flexShrink: 0,
            }}
          />
        )}
        {logoIncludesSiteName ? null : (
          <Text
            variant="h5"
            style={{
              color: black
                ? theme.palette.common.black
                : theme.palette.common.white,
              margin: '0 12px 0 8px',
            }}
          >
            {siteName}
          </Text>
        )}
      </div>
    </Container>
  );
}
