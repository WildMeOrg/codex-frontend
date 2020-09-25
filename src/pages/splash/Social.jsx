import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import GithubIcon from '@material-ui/icons/GitHub';

export default function Social() {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.palette.primary.main,
        padding: '60px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography component="h5" variant="h5">
        Follow our conservation work
      </Typography>
      <div style={{ marginLeft: 16 }}>
        <FacebookIcon style={{ marginLeft: 24, fontSize: '3em' }} />
        <InstagramIcon style={{ marginLeft: 24, fontSize: '3em' }} />
        <GithubIcon style={{ marginLeft: 24, fontSize: '3em' }} />
      </div>
    </div>
  );
}
