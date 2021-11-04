import React from 'react';
import { FormattedMessage } from 'react-intl';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';

export default function LargeScreenRequired() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isSm) return null;

  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.common.white,
        zIndex: 1,
      }}
    >
      <MainColumn style={{ width: 300 }}>
        <Text
          variant="h5"
          component="h5"
          style={{ padding: '16px 0 8px 16px' }}
          id="LARGE_SCREEN_REQUIRED"
        />
        <Text
          style={{ padding: '0 16px 8px 16px', maxWidth: 460 }}
          id="LARGE_SCREEN_MESSAGE"
        />
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
