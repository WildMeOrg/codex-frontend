import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import Button from '../../Button';
import CustomAlert from '../../Alert';
import DataDisplay from '../../dataDisplays/DataDisplay';
import StandardDialog from '../../StandardDialog';
import Text from '../../Text';
import useGetUsers from '../../../models/users/useGetUsers';
import { cellRendererTypes } from '../../dataDisplays/cellRenderers';
import { getHighestRoleLabelId } from '../../../utils/roleUtils';

function filterCollaborator(
  potentialCollaborator,
  searchTerm,
  userGuid,
  currentCollaboratorGuids,
) {
  // If there is no search term, no users should be returned
  if (!searchTerm) return false;

  // The user should not be able to collaborate with themself
  if (potentialCollaborator?.guid === userGuid) return false;

  // No internal or deactivated users should be available for collaboration
  const isInternal = potentialCollaborator?.is_internal || false;
  const isActive = potentialCollaborator?.is_active || false;
  if (isInternal || !isActive) return false;

  // No users that the user is already collaborating with should be available
  // for collaboration
  if (currentCollaboratorGuids.includes(potentialCollaborator?.guid))
    return false;

  // User name and email are filterable fields
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const fullName =
    potentialCollaborator?.full_name?.toLowerCase().trim() ?? '';
  if (fullName.includes(lowerCaseSearchTerm)) return true;

  const email =
    potentialCollaborator?.email?.toLowerCase().trim() ?? '';
  if (email.includes(lowerCaseSearchTerm)) return true;

  return false;
}

export default function AddCollaboratorButton({
  userData,
  mutation,
}) {
  const intl = useIntl();
  const userGuid = userData?.guid;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserGuid, setSelectedUserGuid] = useState(null);

  const {
    data: users,
    isLoading: isUsersLoading,
    error: getUsersError,
  } = useGetUsers();

  const {
    mutate: addCollaboration,
    isLoading: isAddCollaborationLoading,
    error: addCollaborationError,
    reset: resetAddCollaborationMutation,
  } = mutation;

  const error = addCollaborationError || getUsersError;

  function handleCloseDialog() {
    setIsDialogOpen(false);
    setSearchTerm('');
    setSelectedUserGuid(null);
    resetAddCollaborationMutation();
  }

  function handleSubmitSearchTerm(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const searchValue = formData.get('search');

    setSearchTerm(searchValue);
    setSelectedUserGuid(null);
  }

  const currentCollaboratorGuids = (
    userData?.collaborations || []
  ).map(collaboration => {
    const memberGuids = Object.keys(collaboration?.members || {});
    return memberGuids.find(guid => guid !== userGuid);
  });

  const columns = [
    { name: 'name', labelId: 'NAME', align: 'left' },
    { name: 'email', labelId: 'EMAIL', align: 'left' },
    { name: 'role', labelId: 'ROLE', align: 'left' },
    {
      name: 'created',
      labelId: 'CREATED',
      align: 'left',
      options: {
        cellRenderer: cellRendererTypes.date,
        cellRendererProps: { fancy: true },
      },
    },
  ];

  const tableData = (users || [])
    .filter(user =>
      filterCollaborator(
        user,
        searchTerm,
        userGuid,
        currentCollaboratorGuids,
      ),
    )
    .map(user => ({
      guid: user?.guid,
      email: user?.email,
      name: user?.full_name,
      created: user?.created,
      role: intl.formatMessage({ id: getHighestRoleLabelId(user) }),
    }));

  return (
    <>
      <StandardDialog
        titleId="ADD_COLLABORATION"
        open={isDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {users && (
            <form
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
              onSubmit={handleSubmitSearchTerm}
            >
              <TextField
                name="search"
                variant="outlined"
                fullWidth
                autoFocus
                label={
                  <FormattedMessage id="SEARCH_USER_INSTRUCTION" />
                }
                InputProps={{ startAdornment: <SearchIcon /> }}
              />
              <Button id="SEARCH" display="primary" type="submit" />
            </form>
          )}
          {searchTerm && tableData.length === 0 && (
            <Text
              id="POTENTIAL_COLLABORATOR_SEARCH_NO_RESULTS"
              values={{ searchTerm }}
            />
          )}
          {searchTerm && tableData.length > 0 && (
            <DataDisplay
              idKey="guid"
              columns={columns}
              data={tableData}
              noTitleBar
              variant="secondary"
              tableContainerStyles={{ maxHeight: 360 }}
              selectionControlled
              selectedRow={selectedUserGuid}
              onSelectRow={row => setSelectedUserGuid(row?.guid)}
            />
          )}
          {error && (
            <CustomAlert titleId="SERVER_ERROR" severity="error">
              {error}
            </CustomAlert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            id="CANCEL"
            display="basic"
            onClick={handleCloseDialog}
          />
          <Button
            id="ADD"
            display="primary"
            loading={isAddCollaborationLoading}
            disabled={!selectedUserGuid || isAddCollaborationLoading}
            onClick={() => {
              addCollaboration(
                { userGuid: selectedUserGuid },
                { onSuccess: handleCloseDialog },
              );
            }}
          />
        </DialogActions>
      </StandardDialog>
      <Button
        display="primary"
        id="ADD_COLLABORATION"
        startIcon={<AddIcon />}
        loading={isUsersLoading}
        disabled={isUsersLoading}
        onClick={() => setIsDialogOpen(true)}
      />
    </>
  );
}
