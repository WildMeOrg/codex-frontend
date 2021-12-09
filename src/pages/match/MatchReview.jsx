import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toLower } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import SadScreen from '../../components/SadScreen';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import LargeScreenRequired from './LargeScreenRequired';
import Match from './Match';
import Review from './Review';

const heightStyles = {
  height: '100%',
  minHeight: '100vh',
};

export default function MatchReview() {
  const { id } = useParams();
  const theme = useTheme();

  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const marginTop = isSm ? 56 : 64;

  // fetch data for Id...
  const sightings = [];
  useDocumentTitle('MATCH_REVIEW');
  const [matching, setMatching] = useState(true);

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));

  if (!sighting)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="PAGE_NOT_FOUND"
      />
    );

  return (
    <div
      style={{
        marginTop,
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
