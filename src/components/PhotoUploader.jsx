import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Dashboard from '@uppy/react/lib/Dashboard';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

export default function PhotoUploader({
  title,
  onComplete,
  maxFiles,
}) {
  const intl = useIntl();
  const [uppy, setUppy] = useState(null);

  useEffect(() => {
    const uppyInstance = Uppy({
      meta: { type: 'test' },
      restrictions: {
        maxNumberOfFiles: maxFiles || 10,
        allowedFileTypes: ['.jpg', '.jpeg', '.png'],
      },
      autoProceed: true,
    });

    uppyInstance.on('complete', result => {
      onComplete(result);
    });

    setUppy(uppyInstance);

    return () => uppyInstance.close();
  }, []);

  return (
    <div>
      <Typography variant="subtitle1">{title}</Typography>
      {uppy && (
        <Dashboard
          uppy={uppy}
          width={300}
          height={220}
          locale={{
            strings: {
              dropPaste: intl.formatMessage({
                id: 'UPPY_DROP_PASTE',
              }),
              complete: intl.formatMessage({ id: 'UPPY_COMPLETE' }),
              uploadComplete: intl.formatMessage({
                id: 'UPPY_UPLOAD_COMPLETE',
              }),
              addingMoreFiles: intl.formatMessage({
                id: 'UPPY_ADDING_MORE_FILES',
              }),
              back: intl.formatMessage({ id: 'UPPY_BACK' }),
              dropHint: intl.formatMessage({ id: 'UPPY_DROP_HINT' }),
              copyLinkToClipboardSuccess: intl.formatMessage({
                id: 'UPPY_LINK_COPIED',
              }),
              xFilesSelected: {
                0: intl.formatMessage({
                  id: 'UPPY_SELECTING_ONE_FILE',
                }),
                1: intl.formatMessage({
                  id: 'UPPY_SELECTING_MULTIPLE_FILES',
                }),
              },
              uploadingXFiles: {
                0: intl.formatMessage({
                  id: 'UPPY_UPLOADING_ONE_FILE',
                }),
                1: intl.formatMessage({
                  id: 'UPPY_UPLOADING_MULTIPLE_FILES',
                }),
              },
              processingXFiles: {
                0: intl.formatMessage({
                  id: 'UPPY_PROCESSING_ONE_FILE',
                }),
                1: intl.formatMessage({
                  id: 'UPPY_PROCESSING_MULTIPLE_FILES',
                }),
              },
            },
          }}
          waitForThumbnailsBeforeUpload
          showProgressDetails
        />
      )}
    </div>
  );
}
