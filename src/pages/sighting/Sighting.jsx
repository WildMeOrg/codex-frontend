import React, { useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// import SpeciesIcon from '@material-ui/icons/Category';
// import RegionIcon from '@material-ui/icons/MyLocation';
// import ContextIcon from '@material-ui/icons/NaturePeople';
// import SubmitterIcon from '@material-ui/icons/Person';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Button from '../../components/Button';
import MoreMenu from '../../components/MoreMenu';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeaderNew from '../../components/EntityHeaderNew';
import useAssetGroupSighting from '../../models/assetGroup/useAssetGroupSighting';
import useSighting from '../../models/sighting/useSighting';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useDeleteSighting from '../../models/sighting/useDeleteSighting';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import { formatDate } from '../../utils/formatters';
// import AnnotationsGallery from './AnnotationsGallery';
// import IndividualsGallery from './IndividualsGallery';
import Annotations from './Annotations';
import Photographs from './Photographs';
import OverviewContent from './OverviewContent';
import SightingHistoryDialog from './SightingHistoryDialog';
import FeaturedPhoto from './featuredPhoto/FeaturedPhoto';
import Encounters from './encounters/Encounters';

export default function Sighting({ pending = false }) {
  const { id } = useParams();

  const {
    data: assetGroupSightingData,
    loading: assetGroupLoading,
    error: assetGroupError,
    statusCode: assetGroupStatusCode,
    refresh: refreshAssetGroupData,
  } = useAssetGroupSighting(id);

  const {
    data: sightingData,
    loading: sightingLoading,
    error: sightingError,
    statusCode: sightingStatusCode,
    refresh: refreshSightingData,
  } = useSighting(id);

  const agSightingData = get(assetGroupSightingData, 'config');

  console.log(assetGroupSightingData);

  return (
    <SightingCore
      data={pending ? agSightingData : sightingData}
      loading={pending ? assetGroupLoading : sightingLoading}
      error={pending ? assetGroupError : sightingError}
      statusCode={pending ? assetGroupStatusCode : sightingStatusCode}
      refreshData={pending ? refreshAssetGroupData : refreshSightingData}
      pending={pending}
    />
  );
}

function SightingCore({ data, loading, error, statusCode, refreshData, pending }) {
  const { id } = useParams();
  const history = useHistory();
  const intl = useIntl();

  console.log(data);

  const fieldSchemas = useSightingFieldSchemas();

  const {
    deleteSighting,
    loading: deleteInProgress,
    error: deleteSightingError,
    setError: setDeleteSightingError,
  } = useDeleteSighting();

  /*
    known issue: if data or fieldschemas change values
    or properties this may not update
    switch to data.version?
  */
  const metadata = useMemo(
    () => {
      if (!data || !fieldSchemas) return null;
      return fieldSchemas.map(schema => ({
        ...schema,
        value: schema.getValue(schema, data),
      }));
    },
    [data, fieldSchemas],
  );

  // fetch data for Id...
  useDocumentTitle(`Sighting ${id}`);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const activeTab = window.location.hash || '#overview';

  if (loading) return <LoadingScreen />;
  if (statusCode === 404)
    return (
      <SadScreen
        subtitleId="SIGHTING_NOT_FOUND"
        descriptionId="SIGHTING_NOT_FOUND_DESCRIPTION"
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

  const sightingDisplayDate = get(data, ['startTime']);
  // const encounters = get(data, ['encounters'], []);
  const assets = get(data, 'assets', []);

  return (
    <MainColumn fullWidth>
      <SightingHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <ConfirmDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={async () => {
          const successful = await deleteSighting(id);
          if (successful) {
            setDeleteDialogOpen(false);
            history.push('/');
          }
        }}
        deleteInProgress={deleteInProgress}
        error={deleteSightingError}
        onClearError={() => setDeleteSightingError(null)}
        messageId="CONFIRM_DELETE_SIGHTING_DESCRIPTION"
      />
      <EntityHeaderNew
        renderAvatar={
          <FeaturedPhoto
            data={data}
            loading={loading}
            refreshSightingData={refreshData}
          />
        }
        name={intl.formatMessage(
          { id: 'ENTITY_HEADER_SIGHTING_DATE' },
          {
            date: formatDate(sightingDisplayDate, true),
          },
        )}
        renderOptions={
          <div style={{ display: 'flex' }}>
            <Button id="SUBSCRIBE" display="primary" />
            <MoreMenu
              menuId="sighting-actions"
              items={[
                {
                  id: 'view-history',
                  onClick: () => setHistoryOpen(true),
                  label: 'View history',
                },
                {
                  id: 'delete-sighting',
                  onClick: () => setDeleteDialogOpen(true),
                  label: 'Delete sighting',
                },
              ]}
            />
          </div>
        }
      >
        Reported by George Masterson
      </EntityHeaderNew>
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
          label={<FormattedMessage id="ANIMALS" />}
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
        <OverviewContent
          metadata={metadata}
          sightingData={data}
          sightingId={id}
          refreshSightingData={refreshData}
        />
      )}
      {activeTab === '#photographs' && (
        <Photographs
          assets={assets}
          refreshSightingData={refreshData}
        />
      )}
      {activeTab === '#annotations' && (
        <Annotations
          assets={assets}
          refreshSightingData={refreshData}
        />
      )}
      {activeTab === '#individuals' && (
        <Encounters
          assets={assets}
          sightingData={data}
          refreshSightingData={refreshData}
        />
      )}
    </MainColumn>
  );
}

/*
{activeTab === '#annotations' && (
  <AnnotationsGallery sighting={sighting} />
)} */
