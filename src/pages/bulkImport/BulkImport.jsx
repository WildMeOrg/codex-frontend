import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useGetMe from '../../models/users/useGetMe';
import UnprocessedBulkImportAlert from '../../components/bulkImport/UnprocessedBulkImportAlert';
import Text from '../../components/Text';
import Link from '../../components/Link';
import Button from '../../components/Button';
import ReportSightingsPage from '../../components/report/ReportSightingsPage';
import UploadManager from '../../components/report/UploadManager';
import BulkReport from './ReportForm';

export default function BulkImport() {
  useDocumentTitle('REPORT_SIGHTINGS');

  const { data: userData } = useGetMe();
  const unprocessedAssetGroupId = get(userData, [
    'unprocessed_asset_groups',
    '0',
  ]);

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
      {unprocessedAssetGroupId && (
        <UnprocessedBulkImportAlert
          unprocessedAssetGroupId={unprocessedAssetGroupId}
        />
      )}
      {reporting ? (
        <Button
          onClick={onBack}
          style={{ marginTop: 8, width: 'fit-content' }}
          display="back"
          id="BACK_TO_PHOTOS"
        />
      ) : null}
      {reporting ? (
        <BulkReport assetReferences={files} />
      ) : (
        <>
          <Grid item style={{ marginTop: 20 }}>
            <UploadManager
              disabled={Boolean(unprocessedAssetGroupId)}
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
                noImages ? 'CONTINUE_WITHOUT_PHOTOGRAPHS' : 'CONTINUE'
              }
              disabled={Boolean(unprocessedAssetGroupId)}
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
