import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import StandardDialog from '../../components/StandardDialog';

import usePatchCollaboration from '../../models/collaboration/usePatchCollaboration';

export default function CollaborationEditDialog({
  open,
  onClose,
  collaborationData,
  refresh,
}) {
  console.log('deleteMe collaborationData is: ');
  console.log(collaborationData);
  const [formValues, setFormValues] = useState({});
  const [touched, setTouched] = useState(false);
  const {
    patchCollaboration,
    loading,
    error,
    setError,
    success,
    setSuccess,
  } = usePatchCollaboration();
  function cleanupAndClose() {
    setTouched(false);
    setFormValues({});
    onClose();
  }

  async function saveProperties() {
    const properties = Object.keys(formValues).map(propertyId => ({
      path: `/${propertyId}`,
      value: formValues[propertyId],
    }));

    const success = await patchCollaboration(
      get(collaborationData, 'guid'),
      properties,
    ); // TODO check this

    if (success) {
      refresh();
      cleanupAndClose();
    }
  }

  return (
    <StandardDialog
      open={open}
      onClose={cleanupAndClose}
      titleId="EDIT_COLLABORATION"
      maxWidth="xs"
    >
      <div style={{ padding: '12px 24px' }}>
        <FormControl required style={{ width: 320 }}>
          {/* <TextField // TODO flesh out with the things you want to edit
              id="" */}
        </FormControl>
      </div>
    </StandardDialog>
  );
}
