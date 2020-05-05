import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { get } from 'lodash-es';
import Papa from 'papaparse';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

import { selectEncounterSchema } from '../../modules/encounters/selectors';
import AsyncButton from '../../components/AsyncButton';
import InlineButton from '../../components/InlineButton';
import LabeledInput from '../../components/LabeledInput';
import BigExpansionPanel from '../../components/BigExpansionPanel';
import { selectSiteName } from '../../modules/site/selectors';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';

export default function BulkReport({ onBack, files }) {
  const schema = useSelector(selectEncounterSchema);
  const siteName = useSelector(selectSiteName);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [dataSheet, setDataSheet] = useState(null);

  const [fields, setFields] = useState(
    schema.reduce((memo, field) => {
      memo[field.name] = Boolean(field.required);
      return memo;
    }, {}),
  );

  const enabledFields = Object.keys(fields).filter(
    fieldKey => fields[fieldKey],
  );

  const templateContents = files.map(file => {
    const row = { filename: get(file, 'fileName') };
    enabledFields.forEach(fieldKey => {
      if (fields[fieldKey]) row[fieldKey] = '';
    });
    return row;
  });

  const templateString =
    files.length > 0
      ? Papa.unparse(templateContents, { header: true })
      : enabledFields.join(',');

  return (
    <Grid container direction="column">
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <Grid item>
        <Button
          onClick={onBack}
          style={{ marginTop: 8 }}
          size="small"
          startIcon={<BackIcon />}
        >
          <FormattedMessage id="BACK_TO_PHOTOS" />
        </Button>
      </Grid>
      <Grid item style={{ marginTop: 20 }}>
        <BigExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="generate-template-panel-content"
            id="generate-template-panel-header"
          >
            <Typography variant="subtitle1">
              <FormattedMessage id="CHOOSE_FIELDS" />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography>
              <FormattedMessage id="CHOOSE_FIELDS_DESCRIPTION" />
            </Typography>
            <FormControl component="fieldset">
              <FormGroup>
                {Object.keys(fields).map(fieldKey => {
                  const fieldSchema = schema.find(
                    f => f.name === fieldKey,
                  );
                  return (
                    <FormControlLabel
                      key={fieldKey}
                      control={
                        <Checkbox
                          color="primary"
                          checked={fields[fieldKey]}
                          disabled={fieldSchema.required}
                          onChange={() =>
                            setFields({
                              ...fields,
                              [fieldKey]: !fields[fieldKey],
                            })
                          }
                          size="small"
                        />
                      }
                      label={
                        <FormattedMessage id={fieldSchema.labelId} />
                      }
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </ExpansionPanelDetails>
        </BigExpansionPanel>
        <BigExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="generate-template-panel-content"
            id="generate-template-panel-header"
          >
            <Typography variant="subtitle1">
              <FormattedMessage id="GENERATE_TEMPLATE_LABEL" />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography>
              <FormattedMessage id="GENERATE_TEMPLATE_DESCRIPTION_1" />
            </Typography>
            <Typography style={{ margin: '12px 0' }}>
              <FormattedMessage id="GENERATE_TEMPLATE_DESCRIPTION_2" />
            </Typography>
            <Button variant="outlined">
              <a
                style={{ textDecoration: 'unset', color: 'unset' }}
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  templateString,
                )}`}
                download="template.csv"
              >
                <FormattedMessage id="GENERATE_TEMPLATE" />
              </a>
            </Button>
          </ExpansionPanelDetails>
        </BigExpansionPanel>
        <BigExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="generate-template-panel-content"
            id="generate-template-panel-header"
          >
            <Typography variant="subtitle1">
              <FormattedMessage id="UPLOAD_DATA_SHEET" />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Typography style={{ marginBottom: 12 }}>
              <FormattedMessage id="UPLOAD_DATA_SHEET_DESCRIPTION" />
            </Typography>
            <LabeledInput
              required
              schema={{
                name: 'csvUpload',
                labelId: 'SPECIES',
                fieldType: 'file',
                allowedFileTypes: ['.csv'],
                defaultValue: null,
              }}
              value={dataSheet}
              onChange={uppyFile => {
                setDataSheet(uppyFile);
                const fileUrl = get(uppyFile, 'response.uploadURL');
                if (fileUrl) {
                  Papa.parse(fileUrl, {
                    header: true,
                    download: true,
                    complete: testo => {
                      console.log(testo);
                    },
                  });
                }
              }}
              size="medium"
              style={{ width: '100% ' }}
            />
          </ExpansionPanelDetails>
        </BigExpansionPanel>
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptEmails}
              onChange={() => setAcceptEmails(!acceptEmails)}
            />
          }
          label={
            <FormattedMessage
              id="BULK_SIGHTING_EMAIL_CONSENT"
              values={{ siteName }}
            />
          }
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
          }
          label={
            <span>
              <FormattedMessage id="TERMS_CHECKBOX_1" />
              <InlineButton onClick={() => setDialogOpen(true)}>
                <FormattedMessage id="TERMS_CHECKBOX_2" />
              </InlineButton>
              <FormattedMessage id="END_OF_SENTENCE" />
            </span>
          }
        />
      </Grid>
      <Grid
        item
        style={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AsyncButton
          onClick={() => {
            // check that terms and conditions were accepted
            setTermsError(!acceptedTerms);

            if (acceptedTerms) {
              console.log('Time to report the sighting');
              setLoading(true);
              setTimeout(() => {
                console.log('Sighting submitted');
                setLoading(false);
              }, 150000);
            }
          }}
          style={{ width: 200 }}
          loading={loading}
          variant="contained"
          color="secondary"
        >
          <FormattedMessage id="REPORT_SIGHTINGS" />
        </AsyncButton>
      </Grid>
      <Grid style={{ marginTop: 12 }} item>
        {termsError && (
          <Typography color="error">
            <FormattedMessage id="TERMS_ERROR" />
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
