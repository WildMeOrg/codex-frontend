import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MainColumn from '../../components/MainColumn';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import StandardReport from './StandardReport';
import BulkReport from './BulkReport';
import UploadManager from './UploadManager';

export default function ReportEncounters() {
  useDocumentTitle('Report Encounters');
  const [mode, setMode] = useState('standard'); // ''
  const [files, setFiles] = useState([]);
  const [reporting, setReporting] = useState(true); // false

  const noImages = mode !== '' && files.length === 0;

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
                    value="standard"
                    control={<Radio />}
                    onClick={e => {
                      if (e.target.value) setMode(e.target.value);
                    }}
                    label={<FormattedMessage id="ONE_SIGHTING" />}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="ONE_SIGHTING_DESCRIPTION" />
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
              <Grid item>
                <UploadManager files={files} setFiles={setFiles} />
              </Grid>
            )}

            <Grid item>
              <Button
                variant="contained"
                color={noImages ? 'default' : 'secondary'}
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
        {reporting && mode === 'standard' && <StandardReport />}
        {reporting && mode === 'bulk' && <BulkReport />}
      </Grid>
    </MainColumn>
  );
}
