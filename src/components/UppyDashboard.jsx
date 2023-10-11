import React from 'react';
import { useIntl } from 'react-intl';

import Skeleton from '@material-ui/lab/Skeleton';
import Dashboard from '@uppy/react/lib/Dashboard';

const dashboardWidth = 1000;
const dashboardHeight = 400;

export default function UppyDashboard({
  uppyInstance,
  disabled = false,
  ...rest
}) {
  const intl = useIntl();

  if (!uppyInstance) {
    return (
      <Skeleton
        variant="rect"
        style={{
          width: '100%',
          maxWidth: dashboardWidth,
          height: dashboardHeight,
        }}
      />
    );
  }

  return (
    <div
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : undefined,
      }}
    >
      <div style={{ marginBottom: 32, maxWidth: dashboardWidth }}>
        <Dashboard
          uppy={uppyInstance}
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
          {...rest}
        />
      </div>
    </div>
  );
}
