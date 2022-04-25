import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { get, map } from 'lodash-es';
import { useQueryClient } from 'react-query';

import {
  getAGSQueryKey,
  getSightingQueryKey,
} from '../../constants/queryKeys';
import timePrecisionMap from '../../constants/timePrecisionMap';
import defaultSightingSrc from '../../assets/defaultSighting.png';
import MainColumn from '../../components/MainColumn';
import Link from '../../components/Link';
import Tabs from '../../components/Tabs';
import Text from '../../components/Text';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import MoreMenu from '../../components/MoreMenu';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeader from '../../components/EntityHeader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useDeleteSighting from '../../models/sighting/useDeleteSighting';
import useDeleteAssetGroupSighting from '../../models/assetGroupSighting/useDeleteAssetGroupSighting';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import { formatDateCustom } from '../../utils/formatters';
import Annotations from './Annotations';
import Photographs from './Photographs';
import OverviewContent from './OverviewContent';
import SightingHistoryDialog from './SightingHistoryDialog';
import CommitBanner from './CommitBanner';
import FeaturedPhoto from '../../components/FeaturedPhoto';
import Encounters from './encounters/Encounters';

const tabItems = [
  {
    labelId: 'OVERVIEW',
    value: 'overview',
  },
  {
    labelId: 'PHOTOGRAPHS',
    value: 'photographs',
  },
  {
    labelId: 'ANNOTATIONS',
    value: 'annotations',
  },
  {
    labelId: 'ANIMALS',
    value: 'individuals',
  },
];

export default function SightingCore({
  data,
  loading,
  error,
  statusCode,
  pending,
  id,
}) {
  const history = useHistory();
  const intl = useIntl();
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

  const dataForFeaturedPhoto = useMemo(
    () => {
      const assets = get(data, ['assets'], []);
      const modifiedAssets = map(
        assets,
        asset => {
          return { ...asset, altText: asset?.filename };
        },
        [],
      );
      return {
        ...data,
        assets: modifiedAssets,
      };
    },
    [data],
  );

  useDocumentTitle(`Sighting ${id}`, { translateMessage: false });

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
  if (!data)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="SIGHTING_NOT_FOUND"
      />
    );
  if (error) return <SadScreen variant="genericError" />;

  const assets = get(data, 'assets', []);

  const sightingTime = data?.time;
  const sightingTimeSpecificity = data?.timeSpecificity;
  const formatSpecification = get(
    timePrecisionMap,
    [sightingTimeSpecificity, 'prettyFormat'],
    'yyyy-MM-dd',
  );
  const sightingDisplayDate = formatDateCustom(
    sightingTime,
    formatSpecification,
  );

  const sightingCreator = data?.creator;
  const creatorName =
    sightingCreator?.full_name ||
    intl.formatMessage({ id: 'UNNAMED_USER' });
  const creatorUrl = `/users/${sightingCreator?.guid}`;

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
      <EntityHeader
        renderAvatar={
          <FeaturedPhoto
            data={pending ? null : dataForFeaturedPhoto}
            loading={loading}
            refreshData={refreshData}
            defaultPhotoSrc={defaultSightingSrc}
            sightingId={data?.guid}
          />
        }
        name={intl.formatMessage(
          { id: 'ENTITY_HEADER_SIGHTING_DATE' },
          { date: sightingDisplayDate },
        )}
        renderTabs={
          <Tabs
            value={activeTab.replace('#', '')}
            onChange={(_, newValue) => {
              window.location.hash = newValue;
            }}
            items={tabItems}
          />
        }
        renderOptions={
          <div style={{ display: 'flex' }}>
            {/* <Button id="SUBSCRIBE" display="primary" /> */}
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
        {sightingCreator && (
          <Text variant="body2">
            {intl.formatMessage({ id: 'REPORTED_BY' })}
            <Link to={creatorUrl}>{creatorName}</Link>
          </Text>
        )}
      </EntityHeader>
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
          refreshSightingData={refreshData}
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
