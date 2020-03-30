import React from 'react';
import { FormattedMessage } from 'react-intl';
import NotFoundPage from '../../components/NotFoundPage';

export default function() {
  return (
    <NotFoundPage
      title="404"
      subtitle={<FormattedMessage id="PAGE_NOT_FOUND" />}
      details={<FormattedMessage id="404_DETAILS" />}
    />
  );
}
