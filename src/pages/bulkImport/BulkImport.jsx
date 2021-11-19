import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get, startsWith } from 'lodash-es';
import { Prompt } from 'react-router';

import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useReloadWarning from '../../hooks/useReloadWarning';
import useReportUppyInstance from '../../hooks/useReportUppyInstance';
import useGetMe from '../../models/users/useGetMe';
import UnprocessedBulkImportAlert from '../../components/bulkImport/UnprocessedBulkImportAlert';
import Text from '../../components/Text';
import Link from '../../components/Link';
import Button from '../../components/Button';
import UppyDashboard from '../../components/UppyDashboard';
import ReportSightingsPage from '../../components/report/ReportSightingsPage';
import BulkReportForm from './BulkReportForm';

export default function BulkImport() {
  const intl = useIntl();
  useDocumentTitle('REPORT_SIGHTINGS');

  const { data: userData } = useGetMe();
  const unprocessedAssetGroupId = get(userData, [
    'unprocessed_asset_groups',
    '0',
  ]);

  const [reporting, setReporting] = useState(false);

  const { uppy, uploadInProgress, files } = useReportUppyInstance(
    'Bulk import image upload',
  );
  const noImages = files.length === 0;
  const reportInProgress = files.length > 0;
  useReloadWarning(reportInProgress);

  const onBack = () => {
    window.scrollTo(0, 0);
    setReporting(false);
  };

  return (
    <ReportSightingsPage titleId="BULK_IMPORT" authenticated>
      <Prompt
        when={reportInProgress}
        message={location => {
          const newLocation = get(location, 'pathname');
          if (startsWith(newLocation, '/bulk-import/success/'))
            return true;

          return intl.formatMessage({
            id: 'UNSAVED_CHANGES_WARNING',
          });
        }}
      />
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
        <BulkReportForm assetReferences={files} />
      ) : (
        <>
          <Grid item style={{ marginTop: 20 }}>
            <UppyDashboard
              disabled={Boolean(unprocessedAssetGroupId)}
              uppyInstance={uppy}
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
              disabled={
                uploadInProgress || Boolean(unprocessedAssetGroupId)
              }
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
