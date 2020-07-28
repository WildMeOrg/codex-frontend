import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { toLower } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import NotFoundPage from '../../components/NotFoundPage';
import Button from '../../components/Button';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { selectSightings } from '../../modules/sightings/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import fluke from '../../assets/fluke1.png';
import fluke2 from '../../assets/fluke2.jpeg';
import PhotoTile from './PhotoTile';

const currentAnnotationId = 'currentAnnotation';
const candidateMatchId = 'candidateMatch';

export default function Match({ setMatching }) {
  const intl = useIntl();
  const { id } = useParams();

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  useDocumentTitle(intl.formatMessage({ id: 'MATCH_REVIEW' }));
  const [drawerOpen, setDrawerOpen] = useState(true);

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));

  if (!sighting)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="MATCH_NOT_FOUND" />}
      />
    );

  return (
    <>
      <div>
        <GridList
          cols={2}
          cellHeight="auto"
          style={{ margin: 4, transform: 'translateZ(0)' }}
          spacing={8}
        >
          <PhotoTile
            imgSrc={fluke}
            imgId={currentAnnotationId}
            filename="dominica.jpg"
            fileSubtitle={
              <FormattedMessage
                id="SUBMITTED_ON_DATE"
                values={{ date: 'February 14, 2019' }}
              />
            }
            title={intl.formatMessage({ id: 'CURRENT_ANNOTATION' })}
          />
          <PhotoTile
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 500,
            margin: '20px auto',
          }}
        >
          <DataDisplay
            noTitleBar
            variant="secondary"
            data={[
              {
                id: 1,
                category: intl.formatMessage({ id: 'LOCATION' }),
                current: 'Siberia',
                candidate: 'Moscow',
              },
              {
                id: 2,
                category: intl.formatMessage({ id: 'SIGHTING_DATE' }),
                current: '5/22/2020',
                candidate: '4/16/2011',
              },
              {
                id: 3,
                category: intl.formatMessage({ id: 'INDIVIDUAL' }),
                current: '-',
                candidate: 'WB-201',
              },
            ]}
            columns={[
              {
                name: 'category',
                label: <FormattedMessage id="CATEGORY" />,
              },
              {
                name: 'current',
                label: <FormattedMessage id="CURRENT_ANNOTATION" />,
              },
              {
                name: 'candidate',
                label: <FormattedMessage id="CANDIDATE_MATCH" />,
              },
            ]}
          />
          <DataDisplay
            style={{ margin: '20px 0' }}
            noTitleBar
            variant="secondary"
            data={[
              {
                id: 1,
                algorithm: 'Curvrank',
                score: 0.27,
              },
              {
                id: 2,
                algorithm: 'Deepsense',
                score: 0.66,
              },
              {
                id: 3,
                algorithm: intl.formatMessage({ id: 'WEIGHTED_AVG' }),
                score: 0.42,
              },
            ]}
            columns={[
              {
                name: 'algorithm',
                label: <FormattedMessage id="ID_ALGORITHM" />,
              },
              {
                name: 'score',
                label: <FormattedMessage id="SCORE" />,
              },
            ]}
          />
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Button display="secondary">
              <FormattedMessage id="CONFIRM_MATCH" />
            </Button>
          </div>
        </div>
      </div>

      <Paper
        style={{
          display: 'flex',
        }}
        elevation={8}
      >
        <div>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            {drawerOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider orientation="vertical" />
        {drawerOpen && (
          <div style={{ padding: 12 }}>
            <Typography variant="h6" style={{ marginLeft: 4 }}>
              <FormattedMessage
                id="REVIEWING_SIGHITNG_MATCHES"
                values={{ sighting: 'S-101' }}
              />
            </Typography>
            <DataDisplay
              title="Annotations"
              variant="secondary"
              columns={[
                {
                  name: 'id',
                  label: intl.formatMessage({ id: 'ANNOTATION' }),
                },
                {
                  name: 'filename',
                  label: intl.formatMessage({ id: 'FILENAME' }),
                },
                {
                  name: 'match',
                  label: intl.formatMessage({ id: 'MATCH' }),
                },
              ]}
              data={[
                { id: 'asdfj', filename: 'hi.jpg', match: null },
                {
                  id: 'ghlkwe',
                  filename: 'sup.jpg',
                  match: 'WB-103',
                },
                { id: 'wiejfo', filename: 'wow.jpg', match: null },
                { id: 'clwjeq', filename: 'cool.jpg', match: null },
                { id: 'foijeo', filename: 'nice.jpg', match: null },
              ]}
            />
            <DataDisplay
              title="Candidate matches"
              variant="secondary"
              columns={[
                { name: 'id', label: 'Individual' },
                {
                  name: 'curvrank',
                  label: intl.formatMessage(
                    { id: 'ALGORITHM_SCORE' },
                    { algorithm: 'Curvrank' },
                  ),
                },
                {
                  name: 'deepsense',
                  label: intl.formatMessage(
                    { id: 'ALGORITHM_SCORE' },
                    { algorithm: 'Deepsense' },
                  ),
                },
                {
                  name: 'avg',
                  label: intl.formatMessage({ id: 'WEIGHTED_AVG' }),
                },
              ]}
              data={[
                {
                  id: 'asdfj',
                  curvrank: 0.76,
                  deepsense: 0.19,
                  avg: 0.44,
                },
                {
                  id: 'wiejfo',
                  curvrank: 0.38,
                  deepsense: 0.54,
                  avg: 0.51,
                },
                {
                  id: 'clwjeq',
                  curvrank: 0.88,
                  deepsense: 0.34,
                  avg: 0.7,
                },
                {
                  id: 'foijeo',
                  curvrank: 0.23,
                  deepsense: 0.18,
                  avg: 0.19,
                },
              ]}
            />
            <Button
              onClick={() => setMatching(false)}
              display="primary"
              style={{ marginTop: 24 }}
            >
              <FormattedMessage id="REVIEW_AND_FINISH" />
            </Button>
          </div>
        )}
      </Paper>
    </>
  );
}
