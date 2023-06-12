import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router';
import { get, startsWith } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';

import useReportUppyInstance from '../../hooks/useReportUppyInstance';
import useReloadWarning from '../../hooks/useReloadWarning';
import ReportSightingsPage from '../../components/report/ReportSightingsPage';
import Text from '../../components/Text';
import Link from '../../components/Link';
import Button from '../../components/Button';
import UppyDashboard from '../../components/UppyDashboard';
import ReportForm from './ReportForm';
import useGetMe from '../../models/users/useGetMe';
import ReportSightingBreadcrumbs from './ReportSightingBreadcrumbs';
import StandardDialog from '../../components/StandardDialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { set } from 'date-fns';

export default function ReportSighting({ authenticated }) {
  const intl = useIntl();
  const { data: currentUserData } = useGetMe();
  const [reporting, setReporting] = useState(false);

  const { uppy, uploadInProgress, files } = useReportUppyInstance(
    'Report sightings image upload',
  );

  const noImages = files.length === 0;
  const isResearcher = currentUserData?.is_researcher;
  const shouldDisableContinue =
      noImages || (!isResearcher && noImages) || uploadInProgress;
  const reportInProgress = files.length > 0;
  useReloadWarning(reportInProgress);

  const onBack = () => {
    window.scrollTo(0, 0);
    setReporting(false);
    setCurrentPage('Upload Image');
  };
  const handleClick = async () => {
    window.scrollTo(0, 0);
    setReporting(true);
    setCurrentPage('Enter Data');
  }

  let continueButtonText = 'CONTINUE';
  // if (noImages && isResearcher)
  const  skipButtonText = 'SKIP';
  if (uploadInProgress) continueButtonText = 'UPLOAD_IN_PROGRESS';
  const [ currentPage, setCurrentPage ] = useState('Upload Image');
  return (
    <ReportSightingsPage
      titleId="REPORT_A_SIGHTING"
      authenticated={authenticated}
    >
      <ReportSightingBreadcrumbs
        currentPageText={currentPage} />
      <Prompt
        when={reportInProgress}
        message={location => {
          const newLocation = get(location, 'pathname');
          if (startsWith(newLocation, '/report/success/'))
            return true;
          if (startsWith(newLocation, '/pending-sightings/'))
            return true;

          return intl.formatMessage({
            id: 'UNSAVED_CHANGES_WARNING',
          });
        }}
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
        <ReportForm
          authenticated={authenticated}
          assetReferences={files}
        />
      ) : (
        <>
        <div style={{
                      maxWidth: 750,
                     }}>
        <DialogContent>  
            <UppyDashboard style={{ width: '100%' }} uppyInstance={uppy} />
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
                  href="https://docs.wildme.org/product-docs/en/codex/data/optimizing-photographs/"
                  target="_blank"
                >
                  <FormattedMessage id="PHOTO_OPTIMIZE_2" />
                </Link>
                <FormattedMessage id="PHOTO_OPTIMIZE_3" />
              </Text>
            </div>

          </DialogContent>  
          </div>  
            <DialogActions style={{ padding: '0px 24px 24px 24px', maxWidth: 750}}>
              {noImages && isResearcher && <Button
                id={skipButtonText}
                display="basic"
                onClick={async () => {
                  window.scrollTo(0, 0);
                  setReporting(true);
                  setCurrentPage('Enter Data');
                }}
                style={{ marginTop: 16 }}
              />}
              <Button
                id={continueButtonText}
                disabled={shouldDisableContinue}
                display="primary"
                onClick={handleClick}
                style={{ marginTop: 16 }}
              />
            </DialogActions>          
        </>
      )}
    </ReportSightingsPage>
  );
}
