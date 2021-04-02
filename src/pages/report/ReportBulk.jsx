import React, { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';

import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import Text from '../../components/Text';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Link from '../../components/Link';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import BulkReport from './BulkReport';
import UploadManager from './UploadManager';
import ReportSightingsPage from './ReportSightingsPage';

export default function ReportBasic({ authenticated }) {
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
    <ReportSightingsPage authenticated={authenticated}>
      {reporting ? (
        <Button
          onClick={onBack}
          style={{ marginTop: 8, width: 'fit-content' }}
          display="back"
        >
          <FormattedMessage id="BACK_TO_PHOTOS" />
        </Button>
      ) : (
        <ButtonLink
          href="/report"
          style={{ marginTop: 8, width: 'fit-content' }}
          display="back"
        >
          <FormattedMessage id="BACK_TO_SELECTION" />
        </ButtonLink>
      )}
      {reporting ? (
        <BulkReport files={files} />
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
              disabled={false}
              onClick={async () => {
                window.scrollTo(0, 0);
                setReporting(true);
              }}
              style={{ marginTop: 16 }}
            >
              <FormattedMessage
                id={
                  noImages
                    ? 'CONTINUE_WITHOUT_PHOTOGRAPHS'
                    : 'CONTINUE'
                }
              />
            </Button>
          </Grid>
        </>
      )}
    </ReportSightingsPage>
  );
}
