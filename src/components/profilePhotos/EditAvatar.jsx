import React, { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';

import SplashDialog from './SplashDialog';
import CropDialog from './CropDialog';
import UploadDialog from './UploadDialog';
import RemoveDialog from './RemoveDialog';

export default function EditAvatar({
  visible,
  onClose,
  square,
  imageSrc,
  imageGuid,
  refreshUserData,
  userId,
}) {
  const [cropping, setCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  return (
    <>
      <SplashDialog
        open={visible && Boolean(imageSrc)}
        onClose={onClose}
        onCrop={() => {
          onClose();
          setCropping(true);
        }}
        onReplace={() => {
          onClose();
          setUploading(true);
        }}
        onRemove={() => {
          onClose();
          setRemoving(true);
        }}
      />
      <CropDialog
        open={cropping}
        userId={userId}
        onClose={() => {
          refreshUserData();
          setCropping(false);
        }}
        square={square}
        imageSrc={imageSrc}
        imageGuid={imageGuid}
      />
      <UploadDialog
        userId={userId}
        open={(visible && !imageSrc) || uploading}
        onClose={uploadOccurred => {
          if (uploadOccurred) {
            refreshUserData();
            setCropping(true);
          }
          setUploading(false);
          if (visible && !imageSrc) onClose();
        }}
      />
      <RemoveDialog
        userId={userId}
        open={removing}
        onClose={() => {
          refreshUserData();
          setRemoving(false);
        }}
      />
    </>
  );
}
