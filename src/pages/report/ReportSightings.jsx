import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import MainColumn from '../../components/MainColumn';
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
  const [mode, setMode] = useState('one');
  const [files, setFiles] = useState([]);
  const [exifData, setExifData] = useState([]);
  const [reporting, setReporting] = useState(true);
  const noImages = mode !== '' && files.length === 0;

  const onBack = () => setReporting(false);

  return (
    <MainColumn style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ padding: '20px 16px' }}
      >
        <Grid item>
          <Typography variant="h3" component="h3">
            <FormattedMessage id="REPORT_SIGHTINGS" />
          </Typography>
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
                  >
                    <FormControlLabel
                      value="one"
                      control={<Radio />}
                      onClick={e => {
                        if (e.target.value) setMode(e.target.value);
                      }}
                      label={
                        <FormattedMessage id="ONE_SIGHTING_ONE_INDIVIDUAL" />
                      }
                    />
                    <Typography variant="caption">
                      <FormattedMessage id="ONE_SIGHTING_ONE_INDIVIDUAL_DESCRIPTION" />
                    </Typography>
                    <FormControlLabel
                      value="multiple"
                      control={<Radio />}
                      onClick={e => {
                        if (e.target.value) setMode(e.target.value);
                      }}
                      label={
                        <FormattedMessage id="ONE_SIGHTING_MULTIPLE_INDIVIDUALS" />
                      }
                    />
                    <Typography variant="caption">
                      <FormattedMessage id="ONE_SIGHTING_MULTIPLE_INDIVIDUALS_DESCRIPTION" />
                    </Typography>
                    <FormControlLabel
                      value="bulk"
                      control={<Radio />}
                      onClick={e => {
                        if (e.target.value) setMode(e.target.value);
                      }}
                      label={
                        <FormattedMessage id="MULTIPLE_SIGHTINGS" />
                      }
                    />
                    <Typography variant="caption">
                      <FormattedMessage id="MULTIPLE_SIGHTINGS_DESCRIPTION" />
                    </Typography>
                  </RadioGroup>
                </FormControl>
              </Grid>

              {mode !== '' && (
                <Grid item style={{ marginTop: 20 }}>
                  <UploadManager
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
                    <Typography variant="caption">
                      <FormattedMessage id="PHOTO_OPTIMIZE_1" />
                      <Link
                        external
                        href="http://wiki.wildbook.org/en/researchers/photography"
                      >
                        <FormattedMessage id="PHOTO_OPTIMIZE_2" />
                      </Link>
                      <FormattedMessage id="PHOTO_OPTIMIZE_3" />
                    </Typography>
                  </div>
                </Grid>
              )}

              <Grid item>
                <Button
                  display={noImages ? 'subtle' : 'primary'}
                  disabled={!mode}
                  onClick={() => setReporting(true)}
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
