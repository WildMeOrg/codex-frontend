import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash-es';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

import UppyDashboard from '../UppyDashboard';
import Cropper from './Cropper';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

export default function UploadManager({
  files,
  assetSubmissionId,
  onUploadStarted = Function.prototype,
  onUploadComplete = Function.prototype,
  setFiles,
  disabled = false,
}) {
  const [uppy, setUppy] = useState(null);
  const [cropper, setCropper] = useState({
    open: false,
    imgSrc: null,
  });

  /* Resolves closure / useEffect issue */
  // https://www.youtube.com/watch?v=eTDnfS2_WE4&feature=youtu.be
  const fileRef = useRef([]);
  fileRef.current = files;

  useEffect(() => {
    const uppyInstance = Uppy({
      meta: { type: 'Report sightings image upload' },
      restrictions: {
        allowedFileTypes: ['.jpg', '.jpeg', '.png'],
      },
      autoProceed: true,
    });

    uppyInstance.use(Tus, {
      endpoint: `${__houston_url__}/api/v1/asset_groups/tus`,
      headers: {
        'x-tus-transaction-id': assetSubmissionId,
      },
    });

    uppyInstance.on('upload', onUploadStarted);

    uppyInstance.on('complete', uppyState => {
      const uploadObjects = get(uppyState, 'successful', []);
      const assetReferences = uploadObjects.map(o => ({
        path: o.name,
        transactionId: assetSubmissionId,
      }));

      onUploadComplete();
      setFiles([...fileRef.current, ...assetReferences]);
    });

    uppyInstance.on('file-removed', (file, reason) => {
      if (reason === 'removed-by-user') {
        const newFiles = fileRef.current.filter(
          f => f.path !== file.name,
        );
        setFiles(newFiles);
      }
    });

    setUppy(uppyInstance);

    return () => {
      if (uppyInstance) uppyInstance.close();
    };
  }, []);

  return (
    <div
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : undefined,
      }}
    >
      {cropper.open && (
        <Cropper
          imgSrc={cropper.imgSrc}
          onClose={() => setCropper({ open: false, imgSrc: null })}
          setCrop={croppedImage => {
            const currentFile = files.find(
              f => f.filePath === cropper.imgSrc,
            );
            const otherFiles = files.filter(
              f => f.filePath !== cropper.imgSrc,
            );
            setFiles([
              ...otherFiles,
              { ...currentFile, croppedImage },
            ]);
          }}
        />
      )}
      <UppyDashboard uppy={uppy} />
    </div>
  );
}
