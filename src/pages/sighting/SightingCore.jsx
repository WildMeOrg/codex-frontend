import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import {
  getAGSQueryKey,
  getSightingQueryKey,
} from '../../constants/queryKeys';
import errorTypes from '../../constants/errorTypes';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import ConfirmDelete from '../../components/ConfirmDelete';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useDeleteSighting from '../../models/sighting/useDeleteSighting';
import useDeleteAssetGroupSighting from '../../models/assetGroupSighting/useDeleteAssetGroupSighting';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import SightingEntityHeader from './SightingEntityHeader';
import Annotations from './Annotations';
import Photographs from './Photographs';
import OverviewContent from './OverviewContent';
import SightingHistoryDialog from './SightingHistoryDialog';
import CommitBanner from './CommitBanner';
import Encounters from './encounters/Encounters';

export default function SightingCore({
  data,
  loading,
  error,
  statusCode,
  pending,
  id,
}) {
  const history = useHistory();
  const queryClient = useQueryClient();

  const fieldSchemas = useSightingFieldSchemas();

  function refreshData() {
    const queryKey = pending
      ? getAGSQueryKey(id)
      : getSightingQueryKey(id);
    queryClient.invalidateQueries(queryKey);
  }
  const {
    deleteSighting,
    loading: deleteInProgress,
    error: deleteSightingError,
    onClearError: deleteSightingOnClearError,
  } = useDeleteSighting();
  const {
    deleteAssetGroupSighting,
    isLoading: deleteAgsInProgress,
    error: deleteAssetGroupSightingError,
    onClearError: deleteAsgOnClearError,
  } = useDeleteAssetGroupSighting();

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

  useDocumentTitle(`Sighting ${id}`, { translateMessage: false });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const activeTab = window.location.hash || '#overview';

  if (error)
  {
    return <SadScreen
      statusCode={statusCode}
      variantOverrides={{
        [errorTypes.notFound]: {
          subtitleId: 'SIGHTING_NOT_FOUND',
          descriptionId: 'SIGHTING_NOT_FOUND_DESCRIPTION'
        }
      }}
    />
  }
  if (loading) return <LoadingScreen />;

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
          let deleteResults;
          if (pending) {
            deleteResults = await deleteAssetGroupSighting(id);
          } else {
            deleteResults = await deleteSighting(id);
          }
          const successful = pending
            ? deleteResults?.status === 204
            : deleteResults;
          if (successful) {
            setDeleteDialogOpen(false);
            history.push('/');
          }
        }}
        deleteInProgress={
          pending ? deleteAgsInProgress : deleteInProgress
        }
        error={
          pending
            ? deleteAssetGroupSightingError
            : deleteSightingError
        }
        onClearError={
          pending ? deleteAsgOnClearError : deleteSightingOnClearError
        }
        messageId="CONFIRM_DELETE_SIGHTING_DESCRIPTION"
      />
      <SightingEntityHeader
        activeTab={activeTab}
        data={data}
        loading={loading}
        pending={pending}
        guid={id}
        setHistoryOpen={setHistoryOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
      />
      <CommitBanner
        sightingId={id}
        pending={pending}
        sightingData={data}
      />
      {activeTab === '#overview' && (
        <OverviewContent
          metadata={metadata}
          sightingData={data}
          sightingId={id}
          pending={pending}
          refreshSightingData={refreshData}
        />
      )}
      {activeTab === '#photographs' && (
        <Photographs
          assets={assets}
          sightingData={data}
          pending={pending}
        />
      )}
      {activeTab === '#annotations' && (
        <Annotations
          assets={assets}
          refreshSightingData={refreshData}
          pending={pending}
        />
      )}
      {activeTab === '#individuals' && (
        <Encounters
          assets={assets}
          sightingData={data}
          refreshSightingData={refreshData}
          pending={pending}
        />
      )}
    </MainColumn>
  );
}

/*
{activeTab === '#annotations' && (
  <AnnotationsGallery sighting={sighting} />
)} */
