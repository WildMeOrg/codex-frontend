import React from 'react';

import AddIcon from '@material-ui/icons/Add';

import Button from '../../Button';

export default function AddCollaboratorButton() {
  return (
    <Button
      display="primary"
      id="ADD_COLLABORATION"
      startIcon={<AddIcon />}
    />
  );
}
