import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import useDeleteAssetGroup from '../../models/assetGroup/useDeleteAssetGroup';
import useAssetGroup from '../../models/assetGroup/useAssetGroup';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { formatDate } from '../../utils/formatters';

import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Button from '../../components/Button';
import Link from '../../components/Link';
import MoreMenu from '../../components/MoreMenu';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeaderNew from '../../components/EntityHeaderNew';

export default function AssetGroup() {
  const { id } = useParams();
  const history = useHistory();
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
  const agSightingIds = get(data, 'asset_group_sightings', []).map(
    a => get(a, 'guid'),
  );

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
          }
        }}
        deleteInProgress={deleteInProgress}
        error={deleteSightingError}
        onClearError={() => setDeleteSightingError(null)}
        messageId="CONFIRM_DELETE_BULK_IMPORT_DESCRIPTION"
      />
      <EntityHeaderNew
        // renderAvatar={
        //   <FeaturedPhoto
        //     assets={assets}
        //     loading={loading}
        //     editable={assets.length > 0}
        //   />
        // }
        name={intl.formatMessage(
          { id: 'ENTITY_HEADER_BULK_IMPORT_DATE' },
          {
            date: formatDate(dateCreated, true),
          },
        )}
        renderOptions={
          <div style={{ display: 'flex' }}>
            <Button id="SUBSCRIBE" display="primary" />
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
        Reported by George Masterson
      </EntityHeaderNew>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 16,
        }}
      >
        {agSightingIds
          ? agSightingIds.map(agSightingId => (
              <Link
                to={`/pending-sightings/${agSightingId}`}
                key={agSightingId}
              >
                {agSightingId}
              </Link>
            ))
          : null}
      </div>
    </MainColumn>
  );
}
