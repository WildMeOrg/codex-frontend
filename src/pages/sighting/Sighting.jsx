import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, toLower } from 'lodash-es';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

// import SpeciesIcon from '@material-ui/icons/Category';
// import RegionIcon from '@material-ui/icons/MyLocation';
// import ContextIcon from '@material-ui/icons/NaturePeople';
// import SubmitterIcon from '@material-ui/icons/Person';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import DividerTitle from '../../components/DividerTitle';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import { selectSightings } from '../../modules/sightings/selectors';
import useSighting from '../../models/sighting/useSighting';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';
import Status from './Status';
// import AnnotationsGallery from './AnnotationsGallery';
// import IndividualsGallery from './IndividualsGallery';
// import PhotoGallery from './PhotoGallery';
import OverviewContent from './OverviewContent';

export default function Sighting() {
  const { id } = useParams();
  const { data, loading, error } = useSighting(id);

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  useDocumentTitle(`Sighting ${id}`);

  const activeTab = window.location.hash || '#overview';

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));
  const is404 = false;

  if (loading) return <LoadingScreen />;
  if (is404)
    return (
      <SadScreen
        subtitleId="SIGHTING_NOT_FOUND"
        variant="genericError"
      />
    );
  if (error) return <SadScreen variant="genericError" />;
  if (!data)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="SIGHTING_NOT_FOUND"
      />
    );

  console.log(data);
  const sightingDisplayDate = get(data, ['startTime']);
  // const encounters = get(data, ['encounters'], []);

  return (
    <MainColumn fullWidth>
      <Paper style={{ padding: 30, marginTop: 100 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <Text
              variant="h4"
              id="ENTITY_HEADER_SIGHTING_DATE"
              values={{
                date: formatDate(sightingDisplayDate, true),
              }}
            />
            <Text variant="subtitle2" style={{ marginTop: 12 }}>
              Reported by George Masterson
            </Text>
          </div>
        </div>
        <DividerTitle titleId="STATUS" />
        <Status />
      </Paper>
      <Tabs
        value={activeTab.replace('#', '')}
        onChange={(_, newValue) => {
          window.location.hash = newValue;
        }}
        style={{ margin: '32px 0 20px' }}
      >
        <Tab
          label={<FormattedMessage id="OVERVIEW" />}
          value="overview"
        />
        <Tab
          label={<FormattedMessage id="INDIVIDUALS" />}
          value="individuals"
        />
        <Tab
          label={<FormattedMessage id="ANNOTATIONS" />}
          value="annotations"
        />
        <Tab
          label={<FormattedMessage id="PHOTOGRAPHS" />}
          value="photographs"
        />
      </Tabs>
      {activeTab === '#overview' && (
        <OverviewContent sightingData={data} />
      )}
      {/* {activeTab === '#individuals' && (
        <IndividualsGallery sighting={encounters} />
      )}
      {activeTab === '#annotations' && (
        <AnnotationsGallery sighting={sighting} />
      )}
      {activeTab === '#photographs' && (
        <PhotoGallery sighting={sighting} />
      )} */}
    </MainColumn>
  );
}
