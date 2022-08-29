import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import { makeStyles, lighten } from '@material-ui/core/styles';

import errorTypes from '../../constants/errorTypes';
import useDeleteAssetGroup from '../../models/assetGroup/useDeleteAssetGroup';
import useAssetGroup from '../../models/assetGroup/useAssetGroup';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';
import { getProgress } from '../../utils/pipelineStatusUtils';
import queryKeys from '../../constants/queryKeys';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import FormattedReporter from '../../components/formatters/FormattedReporter';
import MoreMenu from '../../components/MoreMenu';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeader from '../../components/EntityHeader';
import CustomAlert from '../../components/Alert';
import ProgressMetrics from '../../components/progress/ProgressMetrics';
import AGSTable from './AGSTable';

const POLLING_INTERVAL = 5000; // 5 seconds

const useStyles = makeStyles(theme => ({
  alert: {
    // extend the progress bar the full width of the alert
    '& .MuiAlert-message': {
      flexGrow: 1,
    },
    // use the info alert's colors instead of the primary site color
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: lighten(theme.palette.info.light, 0.5),
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: theme.palette.info.main,
    },
  },
}));

function isProgressSettled(pipelineStatus) {
  const { skipped, failed, complete } = pipelineStatus || {};

  return skipped || complete || failed;
}

function deriveRefetchInterval(resultData, query) {
  const pipelineStatus = get(
    resultData,
    'data.pipeline_status.preparation',
    {},
  );

  const isSettled = isProgressSettled(pipelineStatus);

  const isError = Boolean(query.state?.error);

  const refetchInterval =
    isSettled || isError ? false : POLLING_INTERVAL;

  return refetchInterval;
}

export default function AssetGroup() {
  const { id: guid } = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const intl = useIntl();
  const classes = useStyles();

  const { data, loading, error, statusCode } = useAssetGroup(guid, {
    queryOptions: { refetchInterval: deriveRefetchInterval },
  });

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
        statusCode={statusCode}
        variantOverrides={{
          [errorTypes.notFound]: {
            subtitleId: 'BULK_IMPORT_NOT_FOUND',
            descriptionId: 'BULK_IMPORT_NOT_FOUND_DESCRIPTION',
          },
        }}
      />
    );
  if (loading) return <LoadingScreen />;

  const dateCreated = get(data, 'created');

  const sightingCreator = data?.creator;

  const pipelineStatusPreparation = get(
    data,
    'pipeline_status.preparation',
    {},
  );
  const isPreparationFailed = pipelineStatusPreparation.failed;

  const showPreparationInProgressAlert = !(
    isPreparationFailed ||
    isProgressSettled(pipelineStatusPreparation)
  );

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
          <FormattedReporter
            variant="body2"
            reporter={{
              guid: sightingCreator.guid,
              fullName: sightingCreator.full_name,
            }}
          />
        )}
      </EntityHeader>
      {isPreparationFailed && (
        <CustomAlert
          titleId="IMAGE_PROCESSING_ERROR"
          descriptionId="IMAGE_PROCESSING_ERROR_MESSAGE"
          severity="error"
        />
      )}
      {showPreparationInProgressAlert && (
        <CustomAlert
          titleId="PENDING_IMAGE_PROCESSING"
          descriptionId="PENDING_IMAGE_PROCESSING_MESSAGE"
          severity="info"
          className={classes.alert}
        >
          <ProgressMetrics
            progress={getProgress(pipelineStatusPreparation)}
            style={{ marginTop: 20 }}
          />
        </CustomAlert>
      )}
      <AGSTable
        assetGroupSightings={get(data, 'asset_group_sightings', [])}
      />
    </MainColumn>
  );
}
