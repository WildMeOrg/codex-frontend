import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { get, toLower } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import RightIcon from '@material-ui/icons/ChevronRight';
import LeftIcon from '@material-ui/icons/ChevronLeft';

import NotFoundPage from '../../components/NotFoundPage';
import Button from '../../components/Button';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { selectSightings } from '../../modules/sightings/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import fluke from '../../assets/fluke.png';
import fluke2 from '../../assets/cascade.jpg';
import AnnotatedPhoto from './AnnotatedPhoto';

const popoverId = 'candidateSelectionPopover';

const pairs = [1, 2, 3, 4, 5, 6];

export default function Match({ setMatching }) {
  const intl = useIntl();
  const { id } = useParams();

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  useDocumentTitle(intl.formatMessage({ id: 'MATCH_REVIEW' }));
  const [popoverData, setPopoverData] = useState(null);

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));

  if (!sighting)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="MATCH_NOT_FOUND" />}
      />
    );

  return (
    <Grid container>
      <Grid
        item
        style={{
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h3">
          <FormattedMessage id="ANNOTATION_MATCH_TOOL" />
        </Typography>
        <Typography variant="subtitle1">Sighting S-101</Typography>
      </Grid>
      <Popover
        id={popoverId}
        open={Boolean(popoverData)}
        anchorEl={get(popoverData, 'element', null)}
        onClose={() => setPopoverData(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{ margin: 20 }}>
          <DataDisplay
            noTitleBar
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
                id: 'WB-201 (Terry)',
                curvrank: 0.76,
                deepsense: 0.19,
                avg: 0.44,
              },
              {
                id: 'WB-882 (Johannesburg)',
                curvrank: 0.38,
                deepsense: 0.54,
                avg: 0.51,
              },
              {
                id: 'WB-412 (Mooshul)',
                curvrank: 0.88,
                deepsense: 0.34,
                avg: 0.7,
              },
              {
                id: 'WB-021 (Jark)',
                curvrank: 0.23,
                deepsense: 0.18,
                avg: 0.19,
              },
            ]}
          />
        </div>
      </Popover>
      {pairs.map(pairId => (
        <Grid item key={pairId} style={{ marginBottom: 50 }}>
          <Typography
            style={{ marginLeft: 20 }}
            variant="h5"
            component="h5"
          >
            {`${pairId}. Annotation 652`}
          </Typography>
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 300,
                alignItems: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                style={{ textDecoration: 'underline' }}
              >
                <FormattedMessage id="THIS_PAIR" />
              </Typography>
              <Typography>Hotspotter 0.52</Typography>
              <Typography>Curvrank 0.74</Typography>
              <Button display="primary" style={{ marginTop: 8 }}>
                <FormattedMessage id="MATCH" />
              </Button>
            </div>
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
              renderTitleButton={() => (
                <Button
                  display="panel"
                  size="small"
                  onClick={event =>
                    setPopoverData({
                      element: event.currentTarget,
                      annotationId: 552,
                    })
                  }
                >
                  <FormattedMessage id="CHANGE" />
                </Button>
              )}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  backgroundColor: 'white',
                  border: '1px solid grey',
                  borderRadius: 12,
                  opacity: 0.9,
                }}
              >
                <IconButton style={{ padding: 8 }}>
                  <LeftIcon />
                </IconButton>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  backgroundColor: 'white',
                  border: '1px solid grey',
                  borderRadius: 12,
                  opacity: 0.9,
                }}
              >
                <IconButton style={{ padding: 8 }}>
                  <RightIcon />
                </IconButton>
              </div>
            </AnnotatedPhoto>
          </div>
        </Grid>
      ))}
      <Grid item style={{ margin: '0 auto' }}>
        <Button
          onClick={() => {
            setMatching(false);
            window.scrollTo(0, 0);
          }}
          display="primary"
          style={{ margin: '24px 0 60px 0' }}
        >
          <FormattedMessage id="REVIEW_AND_FINISH" />
        </Button>
      </Grid>
    </Grid>
  );
}
