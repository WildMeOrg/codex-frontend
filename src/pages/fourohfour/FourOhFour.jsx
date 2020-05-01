import React from 'react';
import { FormattedMessage } from 'react-intl';
import NotFoundPage from '../../components/NotFoundPage';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function({ variant = 'ocean' }) {
  useDocumentTitle('Page not found');
  return (
    <NotFoundPage
      title="404"
      subtitle={<FormattedMessage id="PAGE_NOT_FOUND" />}
      details={<FormattedMessage id="404_DETAILS" />}
      variant={variant}
    />
  );
}
