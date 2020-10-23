import React from 'react';
import SadScreen from '../../components/SadScreen';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function() {
  useDocumentTitle('Page not found');
  return (
    <SadScreen variant="notFoundOcean" subtitleId="PAGE_NOT_FOUND" />
  );
}
