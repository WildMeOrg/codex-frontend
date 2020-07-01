import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { toLower } from 'lodash-es';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import NotFoundPage from '../../components/NotFoundPage';
import Button from '../../components/Button';
import Link from '../../components/Link';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { selectSightings } from '../../modules/sightings/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import fluke from '../../assets/fluke1.png';
import fluke2 from '../../assets/fluke2.jpeg';
import { openFullscreen } from '../../utils/fullscreen';

const heightStyles = {
  height: '100%',
  minHeight: '100vh',
};

const currentAnnotationId = 'currentAnnotation';
const candidateMatchId = 'candidateMatch';

export default function Sighting() {
  const { id } = useParams();

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  useDocumentTitle(`Match review`);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));

  if (!sighting)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="SIGHTING_NOT_FOUND" />}
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
      <div>
        <GridList
          cols={2}
          cellHeight="auto"
          style={{ margin: 4, transform: 'translateZ(0)' }}
          spacing={8}
        >
          <GridListTile>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <Button size="small">Prev</Button>
              <Typography variant="h6">Current annotation</Typography>
              <Button size="small">Next</Button>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                id={currentAnnotationId}
                src={fluke}
                style={{ width: '100%', height: 'auto' }}
              />
              <GridListTileBar
                title="dominica12.jpg"
                subtitle="Submitted February 4, 2019"
                titlePosition="top"
                actionIcon={
                  <IconButton
                    onClick={() => {
                      const image = document.getElementById(
                        currentAnnotationId,
                      );
                      openFullscreen(image);
                    }}
                    style={{ color: 'white', marginRight: 0 }}
                  >
                    <FullscreenIcon style={{ fontSize: 28 }} />
                  </IconButton>
                }
              />
            </div>
          </GridListTile>
          <GridListTile>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <Button size="small">Prev</Button>
              <Typography variant="h6">Candidate match</Typography>
              <Button size="small">Next</Button>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                id={candidateMatchId}
                src={fluke2}
                style={{ width: '100%', height: 'auto' }}
              />
              <GridListTileBar
                title="fluke8.png"
                subtitle="Submitted May 2, 2012 by Bob Krieger"
                titlePosition="top"
                actionIcon={
                  <IconButton
                    onClick={() => {
                      const image = document.getElementById(
                        candidateMatchId,
                      );
                      openFullscreen(image);
                    }}
                    style={{ color: 'white', marginRight: 0 }}
                  >
                    <FullscreenIcon style={{ fontSize: 28 }} />
                  </IconButton>
                }
              />
            </div>
          </GridListTile>
        </GridList>
        <div
          style={{
            margin: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TableContainer
            component={Paper}
            elevation={2}
            style={{ width: 440 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Your Annotation</TableCell>
                  <TableCell>Candidate Match</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Siberia</TableCell>
                  <TableCell>Moscow</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>6/22/2017</TableCell>
                  <TableCell>8/4/2011</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Individual</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Link to="/individuals/wb-201">WB-201</Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer
            component={Paper}
            elevation={2}
            style={{ width: 300, marginTop: 28, marginBottom: 20 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID Algorithm</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Curvrank</TableCell>
                  <TableCell>0.28</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Deepsense</TableCell>
                  <TableCell>0.54</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weighted average</TableCell>
                  <TableCell>0.42</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button display="primary" style={{ marginTop: 20 }}>
            Confirm match
          </Button>
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
            <DataDisplay
              title="Sighting XYZ annotations"
              variant="secondary"
              columns={[
                { name: 'id', label: 'Annotation' },
                { name: 'filename', label: 'Filename' },
                { name: 'matched', label: 'Match' },
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
                { name: 'curvrank', label: 'Curvrank score' },
                { name: 'deepsense', label: 'Deepsense score' },
                { name: 'avg', label: 'Weighted avg.' },
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
          </div>
        )}
      </Paper>
    </div>
  );
}
