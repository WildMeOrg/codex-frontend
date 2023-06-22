import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router';
import { get, startsWith } from 'lodash-es';

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
import StandardDialog from '../../components/StandardDialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ImageIcon from '@material-ui/icons/Image';
import EditIcon from '@material-ui/icons/Edit';
import WarningIcon from '@material-ui/icons/Warning';
import FlagIcon from '@material-ui/icons/Flag';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import useSiteSettings from '../../models/site/useSiteSettings';

export default function ReportSighting({ authenticated }) {
  const intl = useIntl();
  const { data: siteSettings } = useSiteSettings();
  const photoGuidelinesUrl = get(siteSettings, ['site.general.photoGuidelinesUrl', 'value']);
  const { data: currentUserData } = useGetMe();
  const [startForm, setStartForm] = useState(false);

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
    setStartForm(false);
    setCurrentPage('Upload Image');
  };
  const handleClick = async () => {
    window.scrollTo(0, 0);
    setStartForm(true);
    setCurrentIndex(currentIndex + 1);
    setCurrentPage('Enter Required Data');
  }
  const progressArray = ['Upload Image', 'Enter Required Data', 'Enter Optional Data'];
  let continueButtonText = 'CONTINUE';
  // if (noImages && isResearcher)
  const  skipButtonText = 'SKIP';
  if (uploadInProgress) continueButtonText = 'UPLOAD_IN_PROGRESS';
  const [ currentPage, setCurrentPage ] = useState(progressArray[0]);
  const [ currentIndex, setCurrentIndex ] = useState(0);
  const avatarStyle1 = {backgroundColor: '#6D6B7B',}
  const avatarStyle2 = {backgroundColor: '#9D9CAC',}
  const avatarStyle3 = {backgroundColor: '#D2D2D2',}
  const finalStyle = (index) => {
    if (index === currentIndex) {
      return avatarStyle2;
    } else if (index < currentIndex) {
      return avatarStyle1;
    } else if (index > currentIndex) {
      return avatarStyle3;
    }
  };
  return (
    <ReportSightingsPage
      titleId="REPORT_A_SIGHTING"
      authenticated={authenticated}
      currentPage={currentPage}
    >
      <div style= {{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '-22px',
        zIndex: 2}}>
          <Avatar alt="Progress" style={finalStyle(0)}>
            <Icon><ImageIcon/></Icon>
          </Avatar>
          <Avatar alt="Progress" style = {finalStyle(1)}>
            <Icon><WarningIcon/></Icon>
          </Avatar>
          <Avatar alt="Progress" style = {finalStyle(2)}>
            <Icon><EditIcon/></Icon>
          </Avatar>
      </div>
      <LinearProgress variant="determinate" value={currentIndex*100/2} style={{marginBottom: 20,}}/>
      <div style= {{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        }}>
          <p style={{width: 145}}>Upload Image</p>
          <p style={{width: 145, textAlign: "center"}}>Enter Required Data</p>
          <p style={{width: 145, textAlign: 'right'}}>Enter Optional Data</p>
          {/* {progressArray.map((item) => (<p style={{width: 145}}>{item}</p>))}           */}
        </div>
      
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
      {startForm ? (
        <ReportForm
          authenticated={authenticated}
          assetReferences={files}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setStartForm={setStartForm}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
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
                  // href="https://docs.wildme.org/product-docs/en/codex/data/optimizing-photographs/"
                  href={photoGuidelinesUrl}
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
                  setStartForm(true);
                  setCurrentIndex(currentIndex + 1);
                  setCurrentPage('Enter Required Data');
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
