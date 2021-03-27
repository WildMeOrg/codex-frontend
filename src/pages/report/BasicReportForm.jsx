import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get, values } from 'lodash-es';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import ExifIcon from '@material-ui/icons/FlashOn';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSighting from '../../models/sighting/usePutSighting';
import { getLocationSuggestion } from '../../utils/exif';
import categoryTypes from '../../constants/categoryTypes';
import InputRow from '../../components/InputRow';
import Text from '../../components/Text';
import Button from '../../components/Button';
import InlineButton from '../../components/InlineButton';
import FieldCollections from './FieldCollections';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';
import deriveReportSightingSchema from './utils/deriveReportSightingSchema';
import deriveReportEncounterSchema from './utils/deriveReportEncounterSchema';
import prepareReport from './utils/prepareReport';
import { deriveCustomFieldSchema } from './utils/customFieldUtils';

function getInitialFormValues(schema, fieldKey) {
  return schema.reduce((memo, field) => {
    const valueKey = get(field, fieldKey);
    memo[valueKey] = get(field, 'defaultValue');
    return memo;
  }, {});
}

export default function StandardReport({
  assetReferences,
  exifData,
  variant,
}) {
  const intl = useIntl();
  const siteSettings = useSiteSettings();
  const { loading, error: putError, putSighting } = usePutSighting();

  const siteName = get(
    siteSettings,
    ['data', 'site.name', 'value'],
    '<site-name>',
  );

  const {
    schema: customEncounterSchema,
    categories: customEncounterCategories,
  } = deriveCustomFieldSchema(siteSettings, 'Encounter', 'Encounter');
  const {
    schema: customSightingSchema,
    categories: customSightingCategories,
  } = deriveCustomFieldSchema(siteSettings, 'Occurrence', 'Sighting');
  const {
    sightingSchema,
    sightingCategories,
  } = deriveReportSightingSchema(siteSettings);
  const {
    encounterSchema,
    encounterCategories,
  } = deriveReportEncounterSchema(siteSettings);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [exifButtonClicked, setExifButtonClicked] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [termsError, setTermsError] = useState(false);

  const [sightingFormValues, setSightingFormValues] = useState(
    getInitialFormValues(sightingSchema, 'name'),
  );
  const [
    customSightingFormValues,
    setCustomSightingFormValues,
  ] = useState(getInitialFormValues(customSightingSchema, 'id'));
  const [encounterFormValues, setEncounterFormValues] = useState(
    getInitialFormValues(encounterSchema, 'name'),
  );
  const [
    customEncounterFormValues,
    setCustomEncounterFormValues,
  ] = useState(getInitialFormValues(customEncounterSchema, 'id'));

  const locationSuggestion = useMemo(
    () => getLocationSuggestion(exifData),
    [exifData],
  );

  const showErrorAlertBox =
    incompleteFields.length > 0 || termsError || putError;

  console.log('here');

  console.log(customSightingFormValues);

  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <FieldCollections
        formValues={sightingFormValues}
        setFormValues={setSightingFormValues}
        categories={sightingCategories}
        fieldSchema={sightingSchema}
        fieldKey="name"
      />
      <FieldCollections
        formValues={customSightingFormValues}
        setFormValues={setCustomSightingFormValues}
        categories={customSightingCategories}
        fieldSchema={customSightingSchema}
        fieldKey="id"
      />
      {variant === 'one' && (
        <>
          <FieldCollections
            formValues={encounterFormValues}
            setFormValues={setEncounterFormValues}
            categories={customSightingCategories}
            fieldSchema={encounterSchema}
            fieldKey="name"
          />
          <FieldCollections
            formValues={customEncounterFormValues}
            setFormValues={setCustomEncounterFormValues}
            categories={customEncounterCategories}
            fieldSchema={customEncounterSchema}
            fieldKey="id"
          />
        </>
      )}
      <Grid item style={{ marginTop: 30 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptEmails}
              onChange={() => setAcceptEmails(!acceptEmails)}
            />
          }
          label={
            <FormattedMessage
              id="ONE_SIGHTING_EMAIL_CONSENT"
              values={{ siteName }}
            />
          }
        />
      </Grid>
      <Grid item style={{ marginBottom: 12 }}>
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
      {showErrorAlertBox && (
        <Grid item style={{ marginBottom: 12 }}>
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="SUBMISSION_ERROR" />
            </AlertTitle>
            {putError && (
              <p style={{ margin: '4px 0' }}>{putError}</p>
            )}
            {termsError && (
              <p style={{ margin: '4px 0' }}>
                <FormattedMessage id="TERMS_ERROR" />
              </p>
            )}
            {incompleteFields.map(incompleteField => (
              <p
                style={{ margin: '4px 0' }}
                key={incompleteField.name}
              >
                <FormattedMessage
                  id="INCOMPLETE_FIELD"
                  values={{
                    fieldName: intl.formatMessage({
                      id: incompleteField.labelId,
                    }),
                  }}
                />
              </p>
            ))}
          </Alert>
        </Grid>
      )}
      <Grid
        item
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 12,
        }}
      >
        <Button
          onClick={() => {
            // check that required fields are complete
            // const nextIncompleteFields = sightingSchema.filter(
            //   field =>
            //     field.required &&
            //     field.defaultValue === formValues[field.name],
            // );
            // setIncompleteFields(nextIncompleteFields);

            // // check that terms and conditions were accepted
            // setTermsError(!acceptedTerms);

            // if (true) {
            //   // if (nextIncompleteFields.length === 0 && acceptedTerms) {
            //   const report = prepareReport(
            //     variant === 'one',
            //     formValues,
            //     {},
            //   );
            //   console.log(report);
            //   putSighting(report);
            // }
          }}
          style={{ width: 200 }}
          loading={loading}
          display="primary"
        >
          <FormattedMessage id="REPORT_SIGHTING" />
        </Button>
      </Grid>
    </>
  );
}
