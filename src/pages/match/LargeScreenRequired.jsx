import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';

export default function LargeScreenRequired() {
  const theme = useTheme();
  console.log(theme.breakpoints);
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isXs) return null;

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 1,
      }}
    >
      <MainColumn style={{ width: 300 }}>
        <Typography
          variant="h5"
          component="h5"
          style={{ padding: '16px 0 8px 16px' }}
        >
          <FormattedMessage id="LARGE_SCREEN_REQUIRED" />
        </Typography>
        <Typography
          style={{ padding: '0 16px 8px 16px', maxWidth: 460 }}
        >
          <FormattedMessage id="LARGE_SCREEN_MESSAGE" />
        </Typography>
        <ButtonLink
          href="/"
          display="primary"
          style={{ marginTop: 20, marginLeft: 16 }}
        >
          <FormattedMessage id="RETURN_HOME" />
        </ButtonLink>
      </MainColumn>
    </div>
  );
}
