import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import 'react-image-crop/dist/ReactCrop.css';

import queryKeys from '../../constants/queryKeys';
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
  userId,
}) {
  const queryClient = useQueryClient();
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
          queryClient.invalidateQueries(queryKeys.me);
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
            queryClient.invalidateQueries(queryKeys.me);
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
          queryClient.invalidateQueries(queryKeys.me);
          setRemoving(false);
        }}
      />
    </>
  );
}
