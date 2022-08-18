import React, { useState } from 'react';

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
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import AddSocialGroupDialog from './AddSocialGroupDialog';

export default function SocialGroups() {
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
        customBodyRender: (_, { guid }) => (
          <>
            <ActionIcon
              key="view"
              variant="view"
              href={`/social-groups/${guid}`}
            />
            <ActionIcon
              key="delete"
              variant="delete"
              onClick={() => setPendingDeleteGuid(guid)}
            />
          </>
        ),
      },
    },
  ];

  if (error) return <SadScreen statusCode={statusCode} />;
  if (loading) return <LoadingScreen />;

  return (
    <MainColumn>
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
          if (result?.status === 204) setPendingDeleteGuid(null);
        }}
        deleteInProgress={deletePending}
        error={deleteError}
        onClearError={clearDeleteError}
        messageId="SOCIAL_GROUP_DELETE_CONFIRMATION"
      />
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="SOCIAL_GROUPS"
      />
      <SettingsBreadcrumbs currentPageTextId="SOCIAL_GROUPS" />

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
        noResultsTextId="NO_SOCIAL_GROUPS_ON_SITE"
      />
    </MainColumn>
  );
}
