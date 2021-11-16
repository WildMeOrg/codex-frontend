import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router';

import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import useReportUppyInstance from '../../hooks/useReportUppyInstance';
import ReportSightingsPage from '../../components/report/ReportSightingsPage';
import Text from '../../components/Text';
import Link from '../../components/Link';
import Button from '../../components/Button';
import UppyDashboard from '../../components/UppyDashboard';
import ReportForm from './ReportForm';

export default function ReportSighting({ authenticated }) {
  const [reporting, setReporting] = useState(false);

  const { uppy, uploadInProgress, files } = useReportUppyInstance(
    'Report sightings image upload',
  );

  const noImages = files.length === 0;
  const reportInProgress = files.length > 0;

  useEffect(
    () => {
      if (reportInProgress) {
        window.onbeforeunload = () => true;
      } else {
        window.onbeforeunload = null;
      }
      return () => {
        window.onbeforeunload = null;
      };
    },
    [reportInProgress],
  );

  const onBack = () => {
    window.scrollTo(0, 0);
    setReporting(false);
  };

  let continueButtonText = 'CONTINUE';
  if (noImages) continueButtonText = 'CONTINUE_WITHOUT_PHOTOGRAPHS';
  if (uploadInProgress) continueButtonText = 'UPLOAD_IN_PROGRESS';

  return (
    <ReportSightingsPage
      titleId="REPORT_A_SIGHTING"
      authenticated={authenticated}
    >
      <Prompt
        when={reportInProgress}
        message="Are you sure you want to leave this page? Your changes may not be saved."
      />
      {reporting ? (
        <Button
          onClick={onBack}
          style={{ marginTop: 8, width: 'fit-content' }}
          display="back"
          id="BACK_TO_PHOTOS"
        />
      ) : null}
      {reporting ? (
        <ReportForm assetReferences={files} />
      ) : (
        <>
          <Grid item style={{ marginTop: 20 }}>
            <UppyDashboard uppyInstance={uppy} />
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
              id={continueButtonText}
              display="primary"
              disabled={uploadInProgress}
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
