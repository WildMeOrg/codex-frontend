import React from 'react';

import Button from '../Button';
import StandardDialog from '../StandardDialog';

export default function SplashDialog({
  open,
  onClose,
  onCrop,
  onReplace,
  onRemove,
}) {
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="CHANGE_PROFILE_PHOTO"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 12,
        }}
      >
        <Button
          onClick={onReplace}
          display="primary"
          style={{ margin: '4px 0' }}
        >
          Replace photo
        </Button>
        <Button
          onClick={onCrop}
          display="secondary"
          style={{ margin: '4px 0' }}
        >
          Crop photo
        </Button>
        <Button
          onClick={onRemove}
          display="basic"
          style={{ margin: '4px 0', color: 'red' }}
        >
          Remove photo
        </Button>
      </div>
    </StandardDialog>
  );
}
