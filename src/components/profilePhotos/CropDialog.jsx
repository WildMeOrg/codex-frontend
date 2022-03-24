import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ReactCrop from 'react-image-crop';
import CustomAlert from '../Alert';
import 'react-image-crop/dist/ReactCrop.css';

import { useReplaceUserProperty } from '../../models/users/usePatchUser';
import Button from '../Button';
import StandardDialog from '../StandardDialog';

export default function CropDialog({
  open,
  onClose,
  square,
  imageSrc,
  imageGuid,
  userId,
}) {
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 300,
    aspect: 1,
  });
  const [imageData, setImageData] = useState(null);

  const {
    mutate: replaceUserProperty,
    loading: replaceLoading,
    error: replaceError,
    clearError: clearReplaceError,
  } = useReplaceUserProperty();

  async function cropProfilePhoto() {
    const transformX = x =>
      (x * imageData.naturalWidth) / imageData.loadedWidth;
    const transformY = y =>
      (y * imageData.naturalHeight) / imageData.loadedHeight;

    const result = await replaceUserProperty({
      userGuid: userId,
      path: '/profile_fileupload_guid',
      value: {
        guid: imageGuid,
        crop: {
          x: transformX(crop.x),
          y: transformY(crop.y),
          width: transformX(crop.width),
          height: transformY(crop.height),
        },
      },
    });

    if (result?.status === 200) {
      onClose();
      window.location.reload();
    }
  }

  return (
    <StandardDialog
      open={open}
      onClose={() => {
        if (replaceError) clearReplaceError();
        onClose();
      }}
      titleId="CROP_PROFILE_PHOTO"
    >
      <DialogContent>
        {imageSrc && (
          <ReactCrop
            src={imageSrc}
            crop={crop}
            imageStyle={{ width: 300 }}
            onChange={c => setCrop(c)}
            circularCrop={!square}
            onImageLoaded={image => {
              setImageData({
                loadedWidth: image.width,
                loadedHeight: image.height,
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
              });
            }}
          />
        )}
        {replaceError && (
          <CustomAlert
            severity="error"
            titleId="ERROR_UPDATING_PROFILE"
            description={replaceError}
          />
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="primary"
          onClick={cropProfilePhoto}
          autoFocus
          loading={replaceLoading}
        >
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
