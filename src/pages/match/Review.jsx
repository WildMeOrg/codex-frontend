import React from 'react';
import { FormattedMessage } from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import fluke from '../../assets/fluke.png';
import fluke2 from '../../assets/cascade.jpg';
import Button from '../../components/Button';
import Text from '../../components/Text';
import AnnotatedPhoto from './AnnotatedPhoto';

export default function Review({ setMatching }) {
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
      style={{ margin: '30px auto' }}
    >
      <Grid item>
        <Button display="back" onClick={() => setMatching(true)}>
          <FormattedMessage id="BACK_TO_MATCHES" />
        </Button>
      </Grid>
      <Grid style={{ margin: '0 auto' }} item>
        <Text variant="h3" component="h3" id="CONFIRM_AND_SUBMIT_MATCHES" />
      </Grid>
      {annotations.map((annotation, i) => (
        <Grid style={{ marginTop: 20 }} key={annotation.id} item>
          <Text
            component="h5"
            variant="h5"
            style={{ marginBottom: 12 }}
          >
            {`${i + 1}. Matching annotation ${annotation.id} to ${
              annotation.candidateMatch
            }`}
          </Text>
          <Divider />
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100vw',
            }}
          >
            <AnnotatedPhoto
              title="dominica-mar-231.jpg"
              id="1"
              imageWidth={1508}
              imageHeight={1454}
              locationId="Dominica"
              dateString="11/30/2019"
              annotations={[
                {
                  id: 'img1',
                  x: 5,
                  y: 50,
                  w: 85,
                  h: 35,
                },
              ]}
              src={fluke}
            />
            <AnnotatedPhoto
              title="WB-201 (Terry)"
              id="2"
              imageWidth={1024}
              imageHeight={768}
              locationId="Santa Martina"
              dateString="5/12/2007"
              annotations={[
                {
                  id: 'img1',
                  x: 50,
                  y: 5,
                  w: 10,
                  h: 10,
                },
                {
                  id: 'img2',
                  x: 2,
                  y: 15,
                  w: 88,
                  h: 60,
                },
              ]}
              src={fluke2}
            />
          </div>
        </Grid>
      ))}
      <Grid style={{ margin: '0 auto' }} item>
        <Button display="primary">
          <FormattedMessage id="CONFIRM_AND_SUBMIT" />
        </Button>
      </Grid>
    </Grid>
  );
}
