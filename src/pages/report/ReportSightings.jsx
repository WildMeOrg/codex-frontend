import React, { useState, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import ButtonLink from '../../components/ButtonLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Link from '../../components/Link';
import Button from '../../components/Button';
import StandardReport from './StandardReport';
import BulkReport from './BulkReport';
import UploadManager from './UploadManager';

export default function ReportSightings({ authenticated = false }) {
  const intl = useIntl();
  useDocumentTitle(intl.formatMessage({ id: 'REPORT_SIGHTINGS' }));

  const assetSubmissionId = useMemo(uuid, []);
  const [mode, setMode] = useState('');
  const [files, setFiles] = useState([]);
  const [exifData, setExifData] = useState([]);
  const [reporting, setReporting] = useState(false);
  const noImages = mode !== '' && files.length === 0;

  const onBack = () => {
    window.scrollTo(0, 0);
    setReporting(false);
  };
  const radioClick = e => {
    if (e.target.value) {
      setMode(e.target.value);
    }
  };

  return (
    <MainColumn style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ padding: '20px 16px' }}
      >
        <Grid item>
          <Text variant="h3" component="h3" id="REPORT_SIGHTINGS" />
        </Grid>
        {!authenticated && (
          <Grid item style={{ marginTop: 16 }}>
            <Alert
              severity="warning"
              action={
                <ButtonLink
                  style={{ flexShrink: 0, marginRight: 8 }}
                  display="panel"
                  href="/login"
                >
                  <FormattedMessage id="LOG_IN" />
                </ButtonLink>
              }
            >
              <AlertTitle>
                <FormattedMessage id="REPORTING_ANONYMOUSLY" />
              </AlertTitle>
              <FormattedMessage id="REPORTING_ANONYMOUSLY_WARNING" />
            </Alert>
          </Grid>
        )}
        <Grid item container direction="column">
          {!reporting && (
            <>
              <Grid item>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="sharing"
                    name="sharing"
                    value={mode}
                    onClick={radioClick}
                  >
                    <FormControlLabel
                      value="one"
                      control={<Radio />}
                      label={
                        <FormattedMessage id="ONE_SIGHTING_ONE_INDIVIDUAL" />
                      }
                    />
                    <Text
                      variant="caption"
                      id="ONE_SIGHTING_ONE_INDIVIDUAL_DESCRIPTION"
                    />
                    <FormControlLabel
                      value="multiple"
                      control={<Radio />}
                      label={
                        <FormattedMessage id="ONE_SIGHTING_MULTIPLE_INDIVIDUALS" />
                      }
                    />
                    <Text
                      variant="caption"
                      id="ONE_SIGHTING_MULTIPLE_INDIVIDUALS_DESCRIPTION"
                    />
                    <FormControlLabel
                      value="bulk"
                      control={<Radio />}
                      label={
                        <FormattedMessage id="MULTIPLE_SIGHTINGS" />
                      }
                    />
                    <Text
                      variant="caption"
                      id="MULTIPLE_SIGHTINGS_DESCRIPTION"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {mode !== '' && (
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
                    <InfoIcon
                      fontSize="small"
                      style={{ marginRight: 4 }}
                    />
                    <Text variant="caption">
                      <FormattedMessage id="PHOTO_OPTIMIZE_1" />
                      <Link
                        external
                        href="http://wiki.wildbook.org/en/researchers/photography"
                      >
                        <FormattedMessage id="PHOTO_OPTIMIZE_2" />
                      </Link>
                      <FormattedMessage id="PHOTO_OPTIMIZE_3" />
                    </Text>
                  </div>
                </Grid>
              )}

              <Grid item>
                <Button
                  display="primary"
                  disabled={!mode}
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
          {reporting && ['one', 'multiple'].includes(mode) && (
            <StandardReport
              exifData={exifData}
              onBack={onBack}
              variant={mode}
            />
          )}
          {reporting && mode === 'bulk' && (
            <BulkReport onBack={onBack} files={files} />
          )}
        </Grid>
      </Grid>
    </MainColumn>
  );
}
