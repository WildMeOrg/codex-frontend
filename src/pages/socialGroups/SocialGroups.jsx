import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import AddIcon from '@material-ui/icons/Add';

import useSocialGroups from '../../models/socialGroups/useSocialGroups';
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

const columns = [
  {
    id: 'name',
    labelId: 'NAME',
    options: {
      cellRenderer: cellRendererTypes.capitalizedString,
    },
  },
  {
    id: 'guid',
    labelId: 'ACTIONS',
    options: {
      customBodyRender: guid => (
        <ActionIcon
          variant="delete"
          onClick={() => { }}
        />
      ),
    },
  }
]

export default function AssetGroup()
{
  const intl = useIntl();

  const { data, loading, error, statusCode } = useSocialGroups();

  console.log(data);

  useDocumentTitle('SOCIAL_GROUPS');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (error)
    return (
      <SadScreen
        statusCode={statusCode}
      />
    );
  if (loading) return <LoadingScreen />;

  return (
    <MainColumn fullWidth>
      <AddSocialGroupDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}
      />
      <ConfirmDelete
        open={false}
        onClose={() => { }}
        onDelete={() => { }}
        deleteInProgress={true}
        error={null}
        onClearError={() => { }}
        messageId="CONFIRM_DELETE_BULK_IMPORT_DESCRIPTION"
      />
      <EntityHeader
        name={intl.formatMessage(
          { id: 'SOCIAL_GROUPS' },
        )}
      >
        <Text variant="body2">
          Wassoup
        </Text>
      </EntityHeader>

      <Button id="ADD_SOCIAL_GROUP"
        display="primary"
        onClick={() => setAddDialogOpen(true)}
        startIcon={<AddIcon />}
        size="small"
        style={{ float: 'right' }}
      />
      <DataDisplay
        noTitleBar
        data={data}
        columns={columns}
      />
    </MainColumn>
  );
}
