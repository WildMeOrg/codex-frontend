import React, { useState, useCallback } from 'react';

import AddIcon from '@material-ui/icons/Add';

import Button from '../Button';
import Card from './Card';
import RemoveFromSocialGroupDialog from '../dialogs/RemoveFromSocialGroupDialog';
import AddToSocialGroupDialog from '../dialogs/AddToSocialGroupDialog';
import Text from '../Text';
import SocialGroupsDisplay from '../../pages/individual/components/SocialGroupsDisplay';

export default function SocialGroupsCard({
  socialGroups = [],
  individualGuid,
  loading,
  noDataMessageId = 'NO_SOCIAL_GROUPS_ON_INDIVIDUAL',
  title,
  titleId,
}) {
  const noSocialGroups =
    Array.isArray(socialGroups) && socialGroups.length === 0;

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [groupToRemove, setGroupToRemove] = useState(null);

  const handleClose = useCallback(() => {
    setGroupToRemove(null);
  }, []);

  const handleClickDelete = useCallback(socialGroup => {
    setGroupToRemove(socialGroup);
  }, []);

  return (
    <>
      <RemoveFromSocialGroupDialog
        open={Boolean(groupToRemove)}
        onClose={handleClose}
        socialGroup={groupToRemove}
        individualGuid={individualGuid}
      />
      <AddToSocialGroupDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        individualGuid={individualGuid}
      />
      <Card title={title} titleId={titleId}>
        {noSocialGroups ? (
          <Text
            variant="body2"
            id={noDataMessageId}
            style={{ marginTop: 12 }}
          />
        ) : (
          <SocialGroupsDisplay
            individualGuid={individualGuid}
            data={socialGroups}
            loading={loading}
            onClickDelete={handleClickDelete}
            tableContainerStyles={{ maxHeight: 600 }}
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
