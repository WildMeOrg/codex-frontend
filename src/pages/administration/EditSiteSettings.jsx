import React from 'react';
import { useIntl } from 'react-intl';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import SiteSettings from './SiteSettings';

export default function SiteSetup() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'SITE_SETTINGS' }));

  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="SITE_SETTINGS"
      />
      <SiteSettings primaryButtonId="SAVE_CHANGES" />
    </MainColumn>
  );
}
