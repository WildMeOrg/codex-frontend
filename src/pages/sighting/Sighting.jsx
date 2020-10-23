import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, toLower } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import SpeciesIcon from '@material-ui/icons/Category';
// import RegionIcon from '@material-ui/icons/MyLocation';
// import ContextIcon from '@material-ui/icons/NaturePeople';
// import SubmitterIcon from '@material-ui/icons/Person';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import EditProfile from '../../components/EditEntityModal';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Link from '../../components/Link';
import {
  selectSightings,
  selectSightingSchema,
} from '../../modules/sightings/selectors';
import useSighting from '../../models/sighting/useSighting';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';
import Status from './Status';
import AnnotationsGallery from './AnnotationsGallery';
import IndividualsGallery from './IndividualsGallery';
import PhotoGallery from './PhotoGallery';

export default function Sighting() {
  const { id } = useParams();
  const { data, loading, error } = useSighting(
    '560d3721-0ced-48f7-b2d8-acc992d41267',
  );

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  const schema = useSelector(selectSightingSchema);
  useDocumentTitle(`Sighting ${id}`);
  const [editingProfile, setEditingProfile] = useState(false);

  const activeTab = window.location.hash || '#individuals';

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
  if (!sighting)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="SIGHTING_NOT_FOUND"
      />
    );

  const sightingDate = get(data, ['startTime']);
  const formattedSightingDate = sightingDate
    ? formatDate(sightingDate)
    : '';

  return (
    <MainColumn>
      <EditProfile
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={[
          {
            name: 'species',
            value: sighting.taxonomy,
          },
          {
            name: 'location_freeform',
            value: sighting.region,
          },
          {
            name: 'sightingContext',
            value: sighting.context,
          },
        ]}
        fieldSchema={schema}
      />
      <EntityHeader
        name={sighting.id}
        imgSrc={sighting.profile}
        onSettingsClick={() => setEditingProfile(true)}
        editable
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 4,
          }}
        >
          <Typography>
            <FormattedMessage
              id="ENTITY_HEADER_SIGHTING_DATE"
              values={{ date: formattedSightingDate }}
            />
          </Typography>
          <Typography>
            <FormattedMessage
              id="ENTITY_HEADER_REGION"
              values={{ region: sighting.region }}
            />
          </Typography>
          <Typography>
            <FormattedMessage
              id="ENTITY_HEADER_CONTEXT"
              values={{ context: sighting.context }}
            />
          </Typography>
          <Typography>
            <FormattedMessage id="ENTITY_HEADER_SUBMITTER" />
            <Link href={`/users/${sighting.userId}`}>
              {sighting.submitter}
            </Link>
          </Typography>
        </div>
      </EntityHeader>
      <Status />
      <Tabs
        value={activeTab.replace('#', '')}
        onChange={(_, newValue) => {
          window.location.hash = newValue;
        }}
      >
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
      {activeTab === '#individuals' && (
        <IndividualsGallery sighting={sighting} />
      )}
      {activeTab === '#annotations' && (
        <AnnotationsGallery sighting={sighting} />
      )}
      {activeTab === '#photographs' && (
        <PhotoGallery sighting={sighting} />
      )}
    </MainColumn>
  );
}
