import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../../components/Text';

const SocialButton = function ({ Icon, href }) {
  const theme = useTheme();

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <IconButton>
        <Icon
          style={{ fontSize: 32, color: theme.palette.common.black }}
        />
      </IconButton>
    </a>
  );
};

export default function Social() {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const theme = useTheme();

  const facebookLink =
    get(siteSettings, ['site.links.facebookLink', 'value']) ||
    'https://www.facebook.com/wildmeorg/';
  const instagramLink =
    get(siteSettings, ['site.links.instagramLink', 'value']) ||
    'https://www.instagram.com/wildmeorg/';
  const twitterLink =
    get(siteSettings, ['site.links.twitterLink', 'value']) ||
    'https://twitter.com/wildmeorg';

  if (loading || error) return null;

  return (
    <div
      style={{
        backgroundColor: theme.palette.primary.main,
        padding: '60px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text responsive variant="h5" id="FOLLOW_ASK" />
      <div style={{ margin: '0 16px' }}>
        <SocialButton Icon={FacebookIcon} href={facebookLink} />
        <SocialButton Icon={InstagramIcon} href={instagramLink} />
        <SocialButton Icon={TwitterIcon} href={twitterLink} />
      </div>
    </div>
  );
}
