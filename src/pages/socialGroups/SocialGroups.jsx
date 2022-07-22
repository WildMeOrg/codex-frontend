import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import AddIcon from '@material-ui/icons/Add';

import useSocialGroups from '../../models/socialGroups/useSocialGroups';
import useDeleteSocialGroup from '../../models/socialGroups/useDeleteSocialGroup';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';
import MainColumn from '../../components/MainColumn';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import ActionIcon from '../../components/ActionIcon';
import Button from '../../components/Button';
import ConfirmDelete from '../../components/ConfirmDelete';
import EntityHeader from '../../components/EntityHeader';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import AddSocialGroupDialog from './AddSocialGroupDialog';

export default function AssetGroup() {
  const intl = useIntl();

  const { data, loading, error, statusCode } = useSocialGroups();
  const {
    mutate: deleteSocialGroup,
    loading: deletePending,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteSocialGroup();

  useDocumentTitle('SOCIAL_GROUPS');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [pendingDeleteGuid, setPendingDeleteGuid] = useState(null);

  const columns = [
    {
      id: 'name',
      name: 'name',
      labelId: 'NAME',
      options: {
        cellRenderer: cellRendererTypes.capitalizedString,
      },
    },
    {
      id: 'guid',
      name: 'actions',
      labelId: 'ACTIONS',
      options: {
        customBodyRender: (_, { guid }) => [
          <ActionIcon
            key="edit"
            variant="edit"
            href={`/social-groups/${guid}`}
          />,
          <ActionIcon
            key="delete"
            variant="delete"
            onClick={() => setPendingDeleteGuid(guid)}
          />,
        ],
      },
    },
  ];

  if (error) return <SadScreen statusCode={statusCode} />;
  if (loading) return <LoadingScreen />;

  return (
    <MainColumn fullWidth>
      <AddSocialGroupDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
      <ConfirmDelete
        open={Boolean(pendingDeleteGuid)}
        onClose={() => setPendingDeleteGuid(null)}
        onDelete={async () => {
          const result = await deleteSocialGroup({
            guid: pendingDeleteGuid,
          });
          if (result.status === 204) setPendingDeleteGuid(null);
        }}
        deleteInProgress={deletePending}
        error={deleteError}
        onClearError={clearDeleteError}
        messageId="SOCIAL_GROUP_DELETE_CONFIRMATION"
      />
      <EntityHeader
        name={intl.formatMessage({ id: 'SOCIAL_GROUPS' })}
      >
        <Text variant="body2">Wassoup</Text>
      </EntityHeader>

      <Button
        id="ADD_SOCIAL_GROUP"
        display="primary"
        onClick={() => setAddDialogOpen(true)}
        startIcon={<AddIcon />}
        size="small"
        style={{ float: 'right' }}
      />
      <DataDisplay
        noTitleBar
        idKey="guid"
        data={data}
        columns={columns}
      />
    </MainColumn>
  );
}
