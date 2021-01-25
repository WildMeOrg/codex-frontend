import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { FlatfileButton } from '@flatfile/react';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { selectSightingSchema } from '../../modules/sightings/selectors';
import Button from '../../components/Button';
import Text from '../../components/Text';
import InlineButton from '../../components/InlineButton';
import { selectSiteName } from '../../modules/site/selectors';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';
import { flatfileKey } from '../../constants/apiKeys';

export default function BulkReport({ onBack }) {
  const schema = useSelector(selectSightingSchema);
  const siteName = useSelector(selectSiteName);
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [sightingData, setSightingData] = useState(null);

  const [fields, setFields] = useState(
    schema.reduce((memo, field) => {
      memo[field.name] = Boolean(field.required);
      return memo;
    }, {}),
  );

  // const enabledFields = Object.keys(fields).filter(
  //   fieldKey => fields[fieldKey],
  // );

  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <Grid item>
        <Button
          onClick={onBack}
          style={{ marginTop: 8 }}
          display="back"
        >
          <FormattedMessage id="BACK_TO_PHOTOS" />
        </Button>
      </Grid>
      <div style={{ marginLeft: 12 }}>
        <Text variant="h6" style={{ marginTop: 20 }}>
          1. Select fields
        </Text>
      </div>
      <Paper
        elevation={2}
        style={{
          marginTop: 20,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
        }}
      >
        <Text variant="subtitle2" style={{ marginBottom: 12 }} id="CHOOSE_FIELDS_DESCRIPTION" />
        <FormControl component="fieldset">
          <FormGroup style={{ flexDirection: 'row' }}>
            {Object.keys(fields).map(fieldKey => {
              const fieldSchema = schema.find(
                f => f.name === fieldKey,
              );
              if (fieldSchema.required) return null;
              return (
                <FormControlLabel
                  key={fieldKey}
                  style={{ width: 200 }}
                  control={
                    <Checkbox
                      color="primary"
                      checked={fields[fieldKey]}
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
      </Paper>

      <Grid item style={{ marginTop: 20 }}>
        <div style={{ marginLeft: 12 }}>
          <Text variant="h6" style={{ marginTop: 20 }}>
            2. Upload data
          </Text>
        </div>
        <Paper
          elevation={2}
          style={{
            marginTop: 20,
            marginBottom: 32,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 12px',
          }}
        >
          <FlatfileButton
            devMode
            managed
            licenseKey={flatfileKey}
            customer={{ userId: 'dev' }}
            settings={{
              title: 'Import sightings data',
              type: 'bulk_import',
              fields: [
                { label: 'Filename', key: 'filename' },
                { label: 'Species', key: 'species' },
                { label: 'Region', key: 'region' },
                { label: 'Latitude', key: 'lat' },
                { label: 'Longitude', key: 'long' },
                { label: 'Sex', key: 'sex' },
                { label: 'Status', key: 'status' },
                { label: 'Photographer', key: 'photographer' },
                {
                  label: 'Photographer email',
                  key: 'photographer_email',
                },
              ],
              styleOverrides: {
                primaryButtonColor: theme.palette.primary.main,
              },
            }}
            onData={async results => {
              setSightingData(results.data);
            }}
            render={(importer, launch) => (
              <Button
                style={{ width: 260 }}
                display="primary"
                onClick={launch}
              >
                Import sightings data
              </Button>
            )}
          />
          {sightingData ? (
            <Text
              variant="body2"
              style={{ margin: '8px 0 8px 4px' }}
            >{`${
              sightingData.length
                } sightings imported.`}</Text>
          ) : null}
        </Paper>
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
        <Button
          onClick={() => {
            // check that terms and conditions were accepted
            setTermsError(!acceptedTerms);

            if (acceptedTerms) {
              console.log('Time to report the sighting');
              console.log(sightingData);
              setLoading(true);
              setTimeout(() => {
                console.log('Sighting submitted');
                setLoading(false);
              }, 150000);
            }
          }}
          style={{ width: 200 }}
          loading={loading}
          display="primary"
          disabled={!sightingData}
        >
          <FormattedMessage id="REPORT_SIGHTINGS" />
        </Button>
      </Grid>
      <Grid style={{ marginTop: 12 }} item>
        {termsError && (
          <Text color="error" id="TERMS_ERROR" />
        )}
      </Grid>
    </>
  );
}
