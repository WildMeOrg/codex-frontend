import React, { useEffect, useRef, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Uppy from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import DragDrop from '@uppy/react/lib/DragDrop';
import StatusBar from '@uppy/react/lib/StatusBar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {
  transloaditKey,
  transloaditTemplateId,
  transloaditService,
} from '../../constants/apiKeys';
import Cropper from './Cropper';

import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/status-bar/dist/style.css';

export default function UploadManager({ files, setFiles }) {
  const intl = useIntl();
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
        filePath: get(upload, 'response.uploadURL', null),
        croppedImage: null,
      }));
      const newFileList = [...fileRef.current, ...newFiles];

      setFiles(newFileList);
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
          />
        </div>
      )}
      <Grid container spacing={3}>
        {files.map((file, i) => (
          <Grid
            item
            key={file.filePath}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <img
              src={file.croppedImage || file.filePath}
              width={200}
              alt={`Uploaded media #${i + 1}`}
            />
            <div style={{ marginTop: 12 }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: 12 }}
                onClick={() => {
                  setCropper({
                    open: true,
                    imgSrc: file.filePath,
                  });
                }}
              >
                <FormattedMessage id="CROP" />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  const newFileList = files.filter(
                    f => f.filePath !== file.filePath,
                  );
                  setFiles(newFileList);
                }}
                style={{ color: 'red' }}
              >
                <FormattedMessage id="REMOVE" />
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
