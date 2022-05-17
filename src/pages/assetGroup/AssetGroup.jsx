import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import { Fade } from '@material-ui/core';

import errorTypes from '../../constants/errorTypes';
import useDeleteAssetGroup from '../../models/assetGroup/useDeleteAssetGroup';
import useAssetGroupQuery, {
  getAssetGroup,
} from '../../models/assetGroup/useAssetGroupQuery';
import useProgressStateQuery from '../../models/progress/useProgressStateQuery';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';
import { stage as agsStage } from '../../constants/assetGroupSighting';
import queryKeys, {
  getAssetGroupQueryKey,
} from '../../constants/queryKeys';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import Link from '../../components/Link';
import MoreMenu from '../../components/MoreMenu';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeader from '../../components/EntityHeader';
import AGSTable from './AGSTable';
import AssetsProcessingAlert from '../../components/assets/AssetsProcessingAlert';
import { defaultCrossfadeDuration } from '../../constants/defaults';
import { progressState } from '../../constants/progress';

export default function AssetGroup() {
  const { id: guid } = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const intl = useIntl();

  const { data, isLoading, error } = useAssetGroupQuery(guid, {
    notifyOnPropsChange: ['data', 'isLoading', 'error'],
  });

  const assetGroupSightings = get(data, 'asset_group_sightings', []);

  const isAssetGroupPreparing =
    assetGroupSightings[0]?.stage === agsStage.preparation;

  const preparationProgressGuid = get(
    data,
    'progress_preparation.guid',
  );

  const isProgressQueryEnabled = Boolean(
    preparationProgressGuid && isAssetGroupPreparing,
  );

  const {
    state: preparationProgressState,
    error: preparationProgressError,
  } = useProgressStateQuery(
    preparationProgressGuid,
    isProgressQueryEnabled,
  );

  const isPreparationProgressResolved =
    preparationProgressState === progressState.resolved;

  useEffect(
    () => {
      if (isPreparationProgressResolved) {
        queryClient.prefetchQuery(
          getAssetGroupQueryKey(guid),
          getAssetGroup,
        );
      }
    },
    [queryClient, isPreparationProgressResolved],
  );

  const {
    deleteAssetGroup,
    loading: deleteInProgress,
    error: deleteSightingError,
    setError: setDeleteSightingError,
  } = useDeleteAssetGroup();

  useDocumentTitle(`Asset group ${guid}`, {
    translateMessage: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (error)
    return (
      <SadScreen
        statusCode={error.statusCode}
        variantOverrides={{
          [errorTypes.notFound]: {
            subtitleId: 'BULK_IMPORT_NOT_FOUND',
            descriptionId: 'BULK_IMPORT_NOT_FOUND_DESCRIPTION',
          },
        }}
      />
    );

  if (preparationProgressState === progressState.rejected) {
    return (
      <SadScreen
        statusCode={preparationProgressError?.statusCode}
        variantOverrides={{
          [errorTypes.genericError]: {
            descriptionId: 'BULK_IMPORT_PROGRESS_ERROR_DESCRIPTION',
          },
        }}
      />
    );
  }

  if (isLoading) return <LoadingScreen />;

  const dateCreated = get(data, 'created');

  const sightingCreator = data?.creator;
  const creatorName =
    sightingCreator?.full_name ||
    intl.formatMessage({ id: 'UNNAMED_USER' });
  const creatorUrl = `/users/${sightingCreator?.guid}`;

  return (
    <MainColumn fullWidth>
      <ConfirmDelete
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={async () => {
          const successful = await deleteAssetGroup(guid);
          if (successful) {
            setDeleteDialogOpen(false);
            history.push('/');
            queryClient.invalidateQueries(queryKeys.me);
          }
        }}
        deleteInProgress={deleteInProgress}
        error={deleteSightingError}
        onClearError={() => setDeleteSightingError(null)}
        messageId="CONFIRM_DELETE_BULK_IMPORT_DESCRIPTION"
      />
      <EntityHeader
        name={intl.formatMessage(
          { id: 'ENTITY_HEADER_BULK_IMPORT_DATE' },
          {
            date: formatDate(dateCreated, true),
          },
        )}
        renderOptions={
          <div style={{ display: 'flex' }}>
            {/* <Button id="SUBSCRIBE" display="primary" /> */}
            <MoreMenu
              menuId="sighting-actions"
              items={[
                {
                  id: 'delete-asset-group',
                  onClick: () => setDeleteDialogOpen(true),
                  label: intl.formatMessage({
                    id: 'DELETE_BULK_IMPORT',
                  }),
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
      <Fade
        in={isAssetGroupPreparing}
        timeout={{ exit: defaultCrossfadeDuration }}
        unmountOnExit
      >
        <AssetsProcessingAlert
          progressGuid={preparationProgressGuid}
          isAssetGroupPreparing={isAssetGroupPreparing}
        />
      </Fade>
      <AGSTable assetGroupSightings={assetGroupSightings} />
    </MainColumn>
  );
}
