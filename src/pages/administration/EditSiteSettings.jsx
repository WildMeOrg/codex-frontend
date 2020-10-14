import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import SiteSettings from './SiteSettings';

export default function SiteSetup() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'SITE_SETTINGS' }));

  return (
    <MainColumn>
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        <FormattedMessage id="SITE_SETTINGS" />
      </Typography>
      <SiteSettings primaryButtonId="SAVE_CHANGES" />
    </MainColumn>
  );
}
