import React, { useCallback, useState } from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePostSocialGroup from '../../models/socialGroups/usePostSocialGroup';
import CustomAlert from '../../components/Alert';
import StandardDialog from '../../components/StandardDialog';
import Button from '../../components/Button';
import TextInput from '../../components/inputs/TextInput';

export default function AddSocialGroupDialog({ open, onClose }) {
  const {
    mutate: postSocialGroup,
    loading,
    error,
    clearError,
  } = usePostSocialGroup();

  const [name, setName] = useState('');

  const onCloseDialog = useCallback(() => {
    setName('');
    if (error) clearError();
    onClose();
  }, [error]);

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
          onChange={setName}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions
        style={{
          padding: '0px 24px 24px 24px',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        {error && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="SERVER_ERROR"
          >
            {error}
          </CustomAlert>
        )}
        <div>
          <Button
            style={{ marginRight: 4 }}
            display="basic"
            onClick={onCloseDialog}
            id="CLOSE"
          />
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
        </div>
      </DialogActions>
    </StandardDialog>
  );
}
