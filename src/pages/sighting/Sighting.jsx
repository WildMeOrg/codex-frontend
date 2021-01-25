import React, { useState, useMemo } from 'react';
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
import InputRow from '../../components/InputRow';
import DividerTitle from '../../components/DividerTitle';
import LoadingScreen from '../../components/LoadingScreen';
import ActionIcon from '../../components/ActionIcon';
import SadScreen from '../../components/SadScreen';
import DefaultRenderer from '../../components/renderers/DefaultRenderer';
import { selectSightings } from '../../modules/sightings/selectors';
import useSighting from '../../models/sighting/useSighting';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';
import Status from './Status';
import AnnotationsGallery from './AnnotationsGallery';
import IndividualsGallery from './IndividualsGallery';
import PhotoGallery from './PhotoGallery';
import EditSightingMetadata from './EditSightingMetadata';
import MetadataDefinitions from './constants/MetadataDefinitions';

export default function Sighting() {
  const { id } = useParams();
  const { data, loading, error } = useSighting(
    '01c049ce-a936-4c51-bd41-4ba0c39c20ff',
  );

  const mergedFields = useMemo(
    () => {
      if (!data) return null;
      return MetadataDefinitions.map(metadatum => ({
        ...metadatum,
        value: metadatum.getData(data),
      }));
    },
    [get(data, 'version')],
  );

  // fetch data for Id...
  const sightings = useSelector(selectSightings);
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

  const sightingDisplayDate =
    get(data, ['startTime']) || get(data, ['endTime']);

  return (
    <MainColumn>
      <Paper style={{ padding: 30, marginTop: 100 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <Text variant="h4">
              {sightingDisplayDate && (
                <FormattedMessage
                  id="ENTITY_HEADER_SIGHTING_DATE"
                  values={{
                    date: formatDate(sightingDisplayDate, true),
                  }}
                />
              )}
            </Text>
            <Text variant="subtitle" style={{ marginTop: 12 }}>
              Reported by George Masterson
            </Text>
          </div>
          <ActionIcon
            onClick={() => setEditingProfile(true)}
            variant="edit"
          />
        </div>
        <DividerTitle titleId="STATUS" />
        <Status />
        <DividerTitle titleId="METADATA" />

        {mergedFields &&
          mergedFields.map(field => {
            if (!field.value) return null;
            const Renderer = field.renderer || DefaultRenderer;
            return (
              <InputRow labelId={field.labelId} key={field.id}>
                <Renderer value={field.value} />
              </InputRow>
            );
          })}
      </Paper>
      <EditSightingMetadata
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        onSubmit={() => setEditingProfile(false)}
        error={null}
        metadata={mergedFields}
      />
      <Tabs
        value={activeTab.replace('#', '')}
        onChange={(_, newValue) => {
          window.location.hash = newValue;
        }}
        style={{ margin: '32px 0 20px' }}
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
