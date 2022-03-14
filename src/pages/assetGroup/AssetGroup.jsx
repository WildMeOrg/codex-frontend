import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useQueryClient } from 'react-query';

import useDeleteAssetGroup from '../../models/assetGroup/useDeleteAssetGroup';
import useAssetGroup from '../../models/assetGroup/useAssetGroup';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';

import queryKeys from '../../constants/queryKeys';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import Link from '../../components/Link';
import MoreMenu from '../../components/MoreMenu';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeader from '../../components/EntityHeader';
import AGSTable from './AGSTable';

export default function AssetGroup() {
  const { id } = useParams();
  const history = useHistory();
  const queryClient = useQueryClient();
  const intl = useIntl();

  const { data, loading, error, statusCode } = useAssetGroup(id);

  const {
    deleteAssetGroup,
    loading: deleteInProgress,
    error: deleteSightingError,
    setError: setDeleteSightingError,
  } = useDeleteAssetGroup();

  useDocumentTitle(`Asset group ${id}`, { translateMessage: false });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (loading) return <LoadingScreen />;
  if (statusCode === 404)
    return (
      <SadScreen
        subtitleId="BULK_IMPORT_NOT_FOUND"
        descriptionId="BULK_IMPORT_NOT_FOUND_DESCRIPTION"
        variant="genericError"
      />
    );
  if (error) return <SadScreen variant="genericError" />;
  if (!data)
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="BULK_IMPORT_NOT_FOUND"
      />
    );

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
          const successful = await deleteAssetGroup(id);
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
      <AGSTable
        assetGroupSightings={get(data, 'asset_group_sightings', [])}
      />
    </MainColumn>
  );
}
