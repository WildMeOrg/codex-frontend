import React, { useState, useCallback } from 'react';
import { get, omit } from 'lodash-es';

import AddIcon from '@material-ui/icons/Add';

import Button from '../Button';
import Card from './Card';
import AddToSocialGroupDialog from '../dialogs/AddToSocialGroupDialog';
import Text from '../Text';
import usePatchSocialGroup from '../../models/socialGroups/usePatchSocialGroup';
import ConfirmDelete from '../ConfirmDelete';
import SocialGroupsDisplay from '../../pages/individual/components/SocialGroupsDisplay';

export default function SocialGroupsCard({
  socialGroups = [],
  individualGuid,
  loading,
  noDataMessage = 'NO_SOCIAL_GROUPS',
  title,
  titleId,
}) {
  const noSocialGroups =
    Array.isArray(socialGroups) && socialGroups.length === 0;
  const {
    mutate: patchSocialGroup,
    error: patchError,
    loading: patchLoading,
    clearError: clearPatchError,
  } = usePatchSocialGroup();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [groupToRemove, setGroupToRemove] = useState(null);

  const handleClose = useCallback(() => {
    setGroupToRemove(null);
  }, []);

  const handleClickDelete = useCallback(socialGroup => {
    setGroupToRemove(socialGroup);
  }, []);

  const removeIndividualFromSocialGroup = useCallback(async () => {
    const safeMembers = get(groupToRemove, 'members', {});
    const newMembers = omit(safeMembers, individualGuid);
    const result = await patchSocialGroup({
      guid: groupToRemove?.guid,
      members: newMembers,
      affectedIndividualGuids: [individualGuid],
    });
    if (result.status === 200) handleClose();
  }, [individualGuid, groupToRemove, handleClose]);

  return (
    <>
      <ConfirmDelete
        open={Boolean(groupToRemove)}
        onClose={handleClose}
        onDelete={removeIndividualFromSocialGroup}
        deleteInProgress={false}
        error={null}
        onClearError={false}
        messageId="CONFIRM_REMOVE_INDIVIDUAL_FROM_SOCIAL_GROUP"
      />
      <AddToSocialGroupDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        individualGuid={individualGuid}
      />
      <Card title={title} titleId={titleId} maxHeight={600}>
        {noSocialGroups ? (
          <Text
            variant="body2"
            id={noDataMessage}
            style={{ marginTop: 12 }}
          />
        ) : (
          <SocialGroupsDisplay
            individualGuid={individualGuid}
            data={socialGroups}
            loading={loading}
            onClickDelete={handleClickDelete}
          />
        )}

        <Button
          style={{ marginTop: 16 }}
          id="ADD_TO_SOCIAL_GROUP"
          display="primary"
          loading={loading}
          startIcon={<AddIcon />}
          size="small"
          onClick={() => setAddDialogOpen(true)}
        />
      </Card>
    </>
  );
}
