import React from 'react';
import { useTheme } from '@material-ui/core/styles';

import Button from '../Button';
import Text from '../Text';
import StandardDialog from '../StandardDialog';

export default function SplashDialog({
  open,
  onClose,
  onCrop,
  onReplace,
  onRemove,
}) {
  const theme = useTheme();
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
          <Text id="REPLACE_PHOTO" />
        </Button>
        <Button
          onClick={onCrop}
          display="secondary"
          style={{ margin: '4px 0' }}
        >
          <Text id="CROP_PHOTO" />
        </Button>
        <Button
          onClick={onRemove}
          display="basic"
          style={{ margin: '4px 0', color: theme.palette.error.main }}
        >
          <Text id="REMOVE_PHOTO" />
        </Button>
      </div>
    </StandardDialog>
  );
}
