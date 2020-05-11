import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { toLower } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import EditProfile from '../../components/EditProfile';
import Link from '../../components/Link';
import {
  selectSightings,
  selectSightingSchema,
} from '../../modules/sightings/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Status from './Status';
import AnnotationsGallery from './AnnotationsGallery';
import IndividualsGallery from './IndividualsGallery';
import PhotoGallery from './PhotoGallery';

export default function Encounter() {
  const { id } = useParams();

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
  const schema = useSelector(selectSightingSchema);
  useDocumentTitle(`Sighting ${id}`);

  const activeTab = window.location.hash || '#individuals';

  const sighting = sightings.find(e => toLower(e.id) === toLower(id));

  if (!sighting)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="SIGHTING_NOT_FOUND" />}
      />
    );

  const sightingFields = [
    {
      name: 'species',
      value: 'Grampus Griseus',
    },
    {
      name: 'sightingDate',
      value: new Date(),
    },
    {
      name: 'encounterContext',
      value: 'Research effort',
    },
  ];

  return (
    <MainColumn>
      <EntityHeader
        name={sighting.id}
        imgSrc={sighting.profile}
        fieldValues={[]}
        fieldSchema={schema}
        editable
        renderEditDialog={(visible, onClose) => {
          return (
            <EditProfile
              visible={visible}
              onClose={onClose}
              fieldValues={[{
                name: 'species',
                value: sighting.taxonomy,
              }, {
                name: 'location_freeform',
                value: sighting.region,
              }, {
                name: 'sightingContext',
                value: sighting.context,
              }]}
              fieldSchema={schema}
            />
          );
        }}
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
              id="ENTITY_HEADER_SPECIES"
              values={{ species: sighting.taxonomy }}
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
