import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';

import fluke from '../../assets/fluke1.png';
import fluke2 from '../../assets/fluke2.jpeg';
import Button from '../../components/Button';
import PhotoTile from './PhotoTile';

const currentAnnotationId = 'currentAnnotation';
const candidateMatchId = 'candidateMatch';

export default function Review({ setMatching }) {
  const intl = useIntl();

  const annotations = [
    {
      id: 232,
      candidateMatch: 'IND-621 (Pinchy)',
    },
    {
      id: 233,
      candidateMatch: 'IND-329 (Golphus)',
    },
    {
      id: 234,
      candidateMatch: 'IND-810 (Jorble)',
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      style={{ width: '80%', margin: '30px auto' }}
    >
      <Grid item>
        <Button display="back" onClick={() => setMatching(true)}>
          <FormattedMessage id="BACK_TO_MATCHES" />
        </Button>
      </Grid>
      <Grid style={{ margin: '0 auto' }} item>
        <Typography variant="h3" component="h3">
          <FormattedMessage id="REVIEW_AND_CONFIRM_MATCHES" />
        </Typography>
      </Grid>
      {annotations.map((annotation, i) => (
        <Grid style={{ marginTop: 20 }} key={annotation.id} item>
          <Typography
            component="h5"
            variant="h5"
            style={{ marginBottom: 12 }}
          >
            {`${i + 1}. Matching annotation ${annotation.id} to ${
              annotation.candidateMatch
            }`}
          </Typography>
          <GridList
            cols={2}
            cellHeight="auto"
            style={{ margin: 4, transform: 'translateZ(0)' }}
            spacing={8}
          >
            <PhotoTile
              hideButtons
              imgSrc={fluke}
              imgId={currentAnnotationId}
              filename="dominica.jpg"
              fileSubtitle={
                <FormattedMessage
                  id="SUBMITTED_ON_DATE"
                  values={{ date: 'February 14, 2019' }}
                />
              }
              title={intl.formatMessage({
                id: 'CURRENT_ANNOTATION',
              })}
            />
            <PhotoTile
              hideButtons
              imgSrc={fluke2}
              imgId={candidateMatchId}
              filename="fluke8.jpg"
              fileSubtitle={
                <FormattedMessage
                  id="SUBMITTED_ON_DATE"
                  values={{ date: 'November 12, 2011' }}
                />
              }
              title={intl.formatMessage({ id: 'CANDIDATE_MATCH' })}
            />
          </GridList>
        </Grid>
      ))}
      <Grid style={{ margin: '0 auto' }} item>
        <Button display="primary">
          <FormattedMessage id="CONFIRM_ALL_MATCHES" />
        </Button>
      </Grid>
    </Grid>
  );
}
