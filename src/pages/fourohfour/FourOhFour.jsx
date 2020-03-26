import React from 'react';
import NotFoundPage from '../../components/NotFoundPage';

export default function() {
  return (
    <NotFoundPage
      title="404"
      subtitle="Page not found"
      details="The page you are looking for may have been removed or may be temporarily unavailable."
    />
  );
}
