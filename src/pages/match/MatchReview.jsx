import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { toLower } from 'lodash-es';

import NotFoundPage from '../../components/NotFoundPage';
import { selectSightings } from '../../modules/sightings/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import LargeScreenRequired from './LargeScreenRequired';
import Match from './Match';
import Review from './Review';

const heightStyles = {
  height: '100%',
  minHeight: '100vh',
};

export default function MatchReview() {
  const intl = useIntl();
  const { id } = useParams();

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  useDocumentTitle(intl.formatMessage({ id: 'MATCH_REVIEW' }));
  const [matching, setMatching] = useState(true);

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));

  if (!sighting)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="MATCH_NOT_FOUND" />}
      />
    );

  return (
    <div
      style={{
        marginTop: 64,
        width: '100vw',
        display: 'flex',
        ...heightStyles,
      }}
    >
      <LargeScreenRequired />
      {matching ? (
        <Match setMatching={setMatching} />
      ) : (
        <Review setMatching={setMatching} />
      )}
    </div>
  );
}
