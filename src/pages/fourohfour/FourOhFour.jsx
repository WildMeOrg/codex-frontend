import React from 'react';

import errorTypes from '../../constants/errorTypes';
import SadScreen from '../../components/SadScreen';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function() {
  useDocumentTitle('Page not found', { translateMessage: false });
  return (
    <SadScreen
      variant={errorTypes.notFound}
      subtitleId="PAGE_NOT_FOUND"
    />
  );
}
