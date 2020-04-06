import React from 'react';
import { FormattedMessage } from 'react-intl';
import PhotoUploader from '../../components/PhotoUploader';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function ReportEncounters() {
  useDocumentTitle('Report Encounters');

  return (
    <div style={{ marginTop: 100 }}>
      <PhotoUploader
        title={<FormattedMessage id="UPLOAD_PHOTOS" />}
        onComplete={result => {
          console.log(result);
        }}
      />
    </div>
  );
}
