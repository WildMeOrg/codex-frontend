import React, { useCallback } from 'react';
import { get, omit } from 'lodash-es';

import ConfirmDelete from '../ConfirmDelete';
import usePatchSocialGroup from '../../models/socialGroups/usePatchSocialGroup';

export default function RemoveFromSocialGroupDialog({
  open,
  onClose,
  socialGroup,
  individualGuid,
})
{
  const {
    mutate: patchSocialGroup,
    error: patchError,
    loading: patchLoading,
    clearError: clearPatchError,
  } = usePatchSocialGroup();

  const removeIndividualFromSocialGroup = useCallback(async () =>
  {
    const safeMembers = get(socialGroup, 'members', {});
    const newMembers = omit(safeMembers, individualGuid);
    const result = await patchSocialGroup({
      guid: socialGroup?.guid,
      members: newMembers,
      affectedIndividualGuids: [individualGuid],
    });
    if (result.status === 200) onClose();
  }, [individualGuid, socialGroup, onClose]);

  return (
    <ConfirmDelete
      open={open}
      onClose={onClose}
      onDelete={removeIndividualFromSocialGroup}
      deleteInProgress={patchLoading}
      error={patchError}
      onClearError={clearPatchError}
      messageId="CONFIRM_REMOVE_INDIVIDUAL_FROM_SOCIAL_GROUP"
    />
  );
}
