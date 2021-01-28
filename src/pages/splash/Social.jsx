import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import GithubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../../components/Text';

function SocialButton({ Icon, href }) {
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
}

export default function Social() {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const theme = useTheme();

  const facebookLink = get(
    siteSettings,
    ['site.links.facebookLink', 'value'],
    '',
  );
  const instagramLink = get(
    siteSettings,
    ['site.links.instagramLink', 'value'],
    '',
  );
  const twitterLink = get(
    siteSettings,
    ['site.links.twitterLink', 'value'],
    '',
  );
  const antisocial = !(facebookLink || instagramLink || twitterLink);

  if (loading || error || antisocial) return null;

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
        {facebookLink && (
          <SocialButton Icon={FacebookIcon} href={facebookLink} />
        )}
        {instagramLink && (
          <SocialButton Icon={InstagramIcon} href={instagramLink} />
        )}
        {twitterLink && (
          <SocialButton Icon={TwitterIcon} href={twitterLink} />
        )}
        <SocialButton
          Icon={GithubIcon}
          href="https://github.com/WildMeOrg/codex-frontend"
        />
      </div>
    </div>
  );
}
