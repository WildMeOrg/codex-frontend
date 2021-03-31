import React, { useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';

// import useGetUser from '../../models/users/useGetUser';
import SplashDialog from './SplashDialog';
import CropDialog from './CropDialog';
import UploadDialog from './UploadDialog';

export default function EditAvatar({
  visible,
  onClose,
  square,
  imageSrc,
  imageGuid,
}) {
  const [cropping, setCropping] = useState(false);
  const [uploading, setUploading] = useState(false);

  // const {
  //   data: userData,
  //   loading: getLoading,
  //   error: getError,
  //   setError: setGetError,
  // } = useGetUser('5d9ac656-426b-40bf-a7a1-99ffe52f8786');

  return (
    <>
      <SplashDialog
        open={visible}
        onClose={onClose}
        onCrop={() => setCropping(true)}
        onReplace={() => setUploading(true)}
      />
      <CropDialog
        open={cropping}
        onClose={() => {
          setCropping(false);
          onClose();
        }}
        square={square}
        imageSrc={imageSrc}
        imageGuid={imageGuid}
      />
      <UploadDialog
        open={uploading}
        onClose={() => {
          setUploading(false);
          setCropping(true);
        }}
      />
    </>
  );
}
