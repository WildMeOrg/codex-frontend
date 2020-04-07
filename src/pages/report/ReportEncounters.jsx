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
import NoPhotoReport from './NoPhotoReport';

export default function ReportEncounters() {
  useDocumentTitle('Report Encounters');
  const [mode, setMode] = useState(null);
  const [reporting, setReporting] = useState(false);

  return (
    <MainColumn style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid
        container
        direction="column"
        spacing={2}
        style={{ width: 400, marginTop: 20 }}
      >
        {!reporting && (
          <>
            <Grid item>
              <Typography variant="h3" component="h3">
                <FormattedMessage id="REPORT_ENCOUNTERS" />
              </Typography>
            </Grid>
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
                    onClick={e => setMode(e.target.value)}
                    label={<FormattedMessage id="STANDARD_REPORT" />}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="STANDARD_REPORT_DESCRIPTION" />
                  </Typography>
                  <FormControlLabel
                    value="nophoto"
                    control={<Radio />}
                    onClick={e => setMode(e.target.value)}
                    label={<FormattedMessage id="NO_PHOTOGRAPHS" />}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="NO_PHOTOGRAPHS_DESCRIPTION" />
                  </Typography>
                  <FormControlLabel
                    value="bulk"
                    control={<Radio />}
                    onClick={e => setMode(e.target.value)}
                    label={<FormattedMessage id="BULK_UPLOAD" />}
                  />
                  <Typography variant="caption">
                    <FormattedMessage id="BULK_UPLOAD_DESCRIPTION" />
                  </Typography>
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                disabled={!mode}
                onClick={() => setReporting(true)}
              >
                <FormattedMessage id="CONTINUE" />
              </Button>
            </Grid>
          </>
        )}
        {reporting && mode === 'standard' && <StandardReport />}
        {reporting && mode === 'nophoto' && <NoPhotoReport />}
        {reporting && mode === 'bulk' && <BulkReport />}
      </Grid>
    </MainColumn>
  );
}
