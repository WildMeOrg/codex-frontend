import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import Dashboard from '@uppy/react/lib/Dashboard';
import Skeleton from '@material-ui/lab/Skeleton';
import Cropper from './Cropper';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

const dashboardWidth = 600;
const dashboardHeight = 400;

export default function UploadManager({
  files,
  assetSubmissionId,
  onUploadStarted = Function.prototype,
  onUploadComplete = Function.prototype,
  setFiles,
  exifData,
}) {
  const intl = useIntl();
  const currentExifData = useRef();
  currentExifData.current = exifData;

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
    <div>
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
      {uppy ? (
        <div style={{ marginBottom: 32, maxWidth: dashboardWidth }}>
          <Dashboard
            uppy={uppy}
            note={intl.formatMessage({ id: 'UPPY_IMAGE_NOTE' })}
            showLinkToFileUploadResult={false}
            showProgressDetails
            showRemoveButtonAfterComplete
            doneButtonHandler={null}
            height={dashboardHeight}
            locale={{
              strings: {
                dropHereOr: intl.formatMessage({
                  id: 'UPPY_DROP_IMAGES',
                }),
                browse: intl.formatMessage({ id: 'UPPY_BROWSE' }),
                uploading: intl.formatMessage({
                  id: 'UPPY_UPLOADING',
                }),
                complete: intl.formatMessage({ id: 'UPPY_COMPLETE' }),
                uploadFailed: intl.formatMessage({
                  id: 'UPPY_UPLOAD_FAILED',
                }),
                paused: intl.formatMessage({ id: 'UPPY_PAUSED' }),
                retry: intl.formatMessage({ id: 'UPPY_RETRY' }),
                cancel: intl.formatMessage({ id: 'UPPY_CANCEL' }),
                filesUploadedOfTotal: {
                  0: intl.formatMessage({
                    id: 'UPPY_ONE_FILE_PROGRESS',
                  }),
                  1: intl.formatMessage({
                    id: 'UPPY_MULTIPLE_FILES_PROGRESS',
                  }),
                },
                dataUploadedOfTotal: intl.formatMessage({
                  id: 'UPPY_DATA_UPLOADED',
                }),
                xTimeLeft: intl.formatMessage({
                  id: 'UPPY_TIME_LEFT',
                }),
                uploadXFiles: {
                  0: intl.formatMessage({
                    id: 'UPPY_UPLOAD_ONE_FILE',
                  }),
                  1: intl.formatMessage({
                    id: 'UPPY_UPLOAD_MULTIPLE_FILES',
                  }),
                },
                uploadXNewFiles: {
                  0: intl.formatMessage({
                    id: 'UPPY_PLUS_UPLOAD_ONE_FILE',
                  }),
                  1: intl.formatMessage({
                    id: 'UPPY_PLUS_UPLOAD_MULTIPLE_FILES',
                  }),
                },
              },
            }}
          />
        </div>
      ) : (
        <Skeleton
          variant="rect"
          style={{
            width: '100%',
            maxWidth: dashboardWidth,
            height: dashboardHeight,
          }}
        />
      )}
    </div>
  );
}
