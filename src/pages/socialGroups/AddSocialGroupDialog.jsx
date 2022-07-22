import React, { useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePostSocialGroup from '../../models/socialGroups/usePostSocialGroup';
import StandardDialog from '../../components/StandardDialog';
import Button from '../../components/Button';
import TextInput from '../../components/inputs/TextInput';

export default function AddSocialGroupDialog({ open, onClose }) {
  const { mutate: postSocialGroup, loading } = usePostSocialGroup();

  const [name, setName] = useState('');

  const onCloseDialog = () => {
    setName('');
    onClose();
  };

  return (
    <StandardDialog
      maxWidth="xl"
      titleId="ADD_SOCIAL_GROUP"
      open={open}
      onClose={onCloseDialog}
    >
      <DialogContent>
        <TextInput
          schema={{ labelId: 'NAME_OF_GROUP' }}
          value={name}
          onChange={newName => setName(newName)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button display="basic" onClick={onCloseDialog} id="CLOSE" />
        <Button
          display="primary"
          disabled={name === ''}
          loading={loading}
          onClick={async () => {
            const result = await postSocialGroup({ name });
            if (result?.status === 200) onCloseDialog();
          }}
          id="ADD"
        />
      </DialogActions>
    </StandardDialog>
  );
}
