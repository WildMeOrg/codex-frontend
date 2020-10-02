import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import GithubIcon from '@material-ui/icons/GitHub';
import ResponsiveText from '../../components/ResponsiveText';

function SocialButton({ Icon }) {
  const theme = useTheme();

  return (
    <IconButton>
      <Icon
        style={{ fontSize: 32, color: theme.palette.common.black }}
      />
    </IconButton>
  );
}

export default function Social() {
  const theme = useTheme();

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
      <ResponsiveText variant="h5">
        Follow our conservation work
      </ResponsiveText>
      <div style={{ margin: '0 16px' }}>
        <SocialButton Icon={FacebookIcon} />
        <SocialButton Icon={InstagramIcon} />
        <SocialButton Icon={GithubIcon} />
      </div>
    </div>
  );
}
