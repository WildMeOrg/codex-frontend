import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import Dashboard from '@uppy/react/lib/Dashboard';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Text from './Text';

export default function ProfileUploader({ title, onComplete }) {
  const intl = useIntl();
  const [uppy, setUppy] = useState(null);
  const assetSubmissionId = useMemo(uuid, []);

  useEffect(() => {
    const uppyInstance = new Uppy({
      meta: { type: 'test' },
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['.jpg', '.jpeg', '.png'],
      },
      autoProceed: true,
    });

    uppyInstance.use(Tus, {
      endpoint: `${__houston_url__}/api/v1/tus`,
      headers: {
        'x-tus-transaction-id': assetSubmissionId,
      },
    });

    uppyInstance.on('complete', uppyState => {
      const uploadObjects = get(uppyState, 'successful', []);
      const assetReferences = uploadObjects.map(o => ({
        path: o.name,
        transactionId: assetSubmissionId,
      }));
      const result =
        assetReferences.length > 0 ? assetReferences[0] : null;
      onComplete(result);
    });

    setUppy(uppyInstance);

    return () => uppyInstance.close();
  }, []);

  return (
    <div>
      <Text variant="subtitle1">{title}</Text>
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
