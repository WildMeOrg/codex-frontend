import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Uppy from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import DragDrop from '@uppy/react/lib/DragDrop';
import StatusBar from '@uppy/react/lib/StatusBar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Cancel';
import {
  transloaditKey,
  transloaditTemplateId,
  transloaditService,
} from '../../constants/apiKeys';
import { getExifData } from '../../utils/exif';
import Cropper from './Cropper';

import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/status-bar/dist/style.css';

export default function UploadManager({ files, setFiles }) {
  const intl = useIntl();
  const [exifData, setExifData] = useState([]);
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
      meta: { type: 'test' },
      restrictions: {
        allowedFileTypes: ['.jpg', '.jpeg', '.png'],
      },
      autoProceed: true,
    });

    uppyInstance.use(Transloadit, {
      service: transloaditService,
      params: {
        auth: { key: transloaditKey },
        template_id: transloaditTemplateId,
      },
      waitForEncoding: false,
      waitForMetadata: false,
      importFromUploadURLs: false,
      alwaysRunAssembly: false,
      signature: null,
      fields: {},
      limit: 0,
    });

    uppyInstance.on('complete', uppyState => {
      const uploadObjects = get(uppyState, 'successful', []);
      const newFiles = uploadObjects.map(upload => ({
        filePath: get(upload, 'response.uploadURL'),
        fileName: get(upload, 'name'),
        croppedImage: null,
      }));
      const newFileList = [...fileRef.current, ...newFiles];
      setFiles(newFileList);

      const newFilePaths = newFiles.map(file => file.filePath);
      getExifData(newFilePaths, newExifData => {
        setExifData([...exifData, ...newExifData]);
      });
    });

    setUppy(uppyInstance);

    return () => uppyInstance.close();
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
      {uppy && (
        <div style={{ marginBottom: 12, width: 400 }}>
          <DragDrop
            uppy={uppy}
            height={300}
            note={intl.formatMessage({ id: 'UPPY_IMAGE_NOTE' })}
            locale={{
              strings: {
                dropHereOr: intl.formatMessage({
                  id: 'UPPY_DROP_IMAGES',
                }),
                browse: intl.formatMessage({ id: 'UPPY_BROWSE' }),
              },
            }}
          />
          <div style={{ height: 24 }} />
          <StatusBar
            uppy={uppy}
            hideAfterFinish={false}
            showProgressDetails
            locale={{
              strings: {
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
      )}
      <Grid container spacing={3}>
        {files.map((file, i) => (
          <Grid
            item
            key={file.filePath}
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <img
              src={file.croppedImage || file.filePath}
              width={200}
              alt={`Uploaded media #${i + 1}`}
            />
            <svg
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                zIndex: 1001,
              }}
              width={24}
              height={24}
            >
              <circle cx={12} cy={12} r={13} fill="white" />
            </svg>
            <IconButton
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                zIndex: 1001,
              }}
              onClick={() => {
                const newFileList = files.filter(
                  f => f.filePath !== file.filePath,
                );
                setFiles(newFileList);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
