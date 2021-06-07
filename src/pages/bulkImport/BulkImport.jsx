import React, { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';

import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import Text from '../../components/Text';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Link from '../../components/Link';
import Button from '../../components/Button';
import ReportSightingsPage from '../../components/report/ReportSightingsPage';
import UploadManager from '../../components/report/UploadManager';
import BulkReport from './ReportForm';

export default function BulkImport() {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'REPORT_SIGHTINGS' }));

  const assetSubmissionId = useMemo(uuid, []);
  const [files, setFiles] = useState([]);
  const [exifData, setExifData] = useState([]);
  const [reporting, setReporting] = useState(false);
  const noImages = files.length === 0;

  const onBack = () => {
    window.scrollTo(0, 0);
    setReporting(false);
  };

  return (
    <ReportSightingsPage titleId="BULK_IMPORT" authenticated>
      {reporting ? (
        <Button
          onClick={onBack}
          style={{ marginTop: 8, width: 'fit-content' }}
          display="back"
          id="BACK_TO_PHOTOS"
        />
      ) : (
        null
      )}
      {reporting ? (
        <BulkReport assetReferences={files} />
      ) : (
        <>
          <Grid item style={{ marginTop: 20 }}>
            <UploadManager
              assetSubmissionId={assetSubmissionId}
              exifData={exifData}
              setExifData={setExifData}
              files={files}
              setFiles={setFiles}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <InfoIcon fontSize="small" style={{ marginRight: 4 }} />
              <Text variant="caption">
                <FormattedMessage id="PHOTO_OPTIMIZE_1" />
                <Link
                  external
                  href="https://docs.wildme.org/docs/researchers/photography_guidelines"
                >
                  <FormattedMessage id="PHOTO_OPTIMIZE_2" />
                </Link>
                <FormattedMessage id="PHOTO_OPTIMIZE_3" />
              </Text>
            </div>
          </Grid>
          <Grid item>
            <Button
              display="primary"
              id={
                noImages
                  ? 'CONTINUE_WITHOUT_PHOTOGRAPHS'
                  : 'CONTINUE'
              }
              disabled={false}
              onClick={async () => {
                window.scrollTo(0, 0);
                setReporting(true);
              }}
              style={{ marginTop: 16 }}
            />
          </Grid>
        </>
      )}
    </ReportSightingsPage>
  );
}
