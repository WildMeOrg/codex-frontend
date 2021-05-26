import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { addHours, isWithinInterval, isAfter } from 'date-fns';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
// import ExifIcon from '@material-ui/icons/FlashOn';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSighting from '../../models/sighting/usePutSighting';
import useSightingFieldSchemas, {
  defaultSightingCategories,
} from '../../models/sighting/useSightingFieldSchemas';
import useEncounterFieldSchemas, {
  defaultEncounterCategories,
} from '../../models/encounter/useEncounterFieldSchemas';
// import { getLocationSuggestion } from '../../utils/exif';
import Button from '../../components/Button';
import Text from '../../components/Text';
import InlineButton from '../../components/InlineButton';
import FieldCollections from './FieldCollections';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';
import prepareReport from './utils/prepareReport';
import { deriveCustomFieldCategories } from './utils/customFieldUtils';

function getInitialFormValues(schema) {
  return schema.reduce((memo, field) => {
    const valueKey = get(field, 'name');
    memo[valueKey] = get(field, 'defaultValue');
    return memo;
  }, {});
}

export default function BasicReportForm({
  assetReferences,
  // exifData,
  variant,
}) {
  const intl = useIntl();
  const history = useHistory();
  const siteSettings = useSiteSettings();
  const { loading, error: putError, putSighting } = usePutSighting();

  const siteName = get(
    siteSettings,
    ['data', 'site.name', 'value'],
    '<site-name>',
  );

  const customEncounterCategories = deriveCustomFieldCategories(
    siteSettings,
    'Encounter',
    'encounter',
  );
  const customSightingCategories = deriveCustomFieldCategories(
    siteSettings,
    'Occurrence',
    'sighting',
  );

  const sightingFieldSchemas = useSightingFieldSchemas();
  const defaultSightingSchemas = sightingFieldSchemas.filter(
    schema => !schema.customField,
  );
  const customSightingSchemas = sightingFieldSchemas.filter(
    schema => schema.customField,
  );

  const encounterFieldSchemas = useEncounterFieldSchemas();
  const visibleEncounterFieldSchemas = encounterFieldSchemas.filter(
    schema => !schema.hideOnBasicReport,
  );
  const defaultEncounterSchemas = visibleEncounterFieldSchemas.filter(
    schema => !schema.customField,
  );
  const customEncounterSchemas = visibleEncounterFieldSchemas.filter(
    schema => schema.customField,
  );

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // const [exifButtonClicked, setExifButtonClicked] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const [dateOrderError, setDateOrderError] = useState(false);
  const [dateDurationError, setDateDurationError] = useState(false);
  const [locationFieldError, setLocationFieldError] = useState(false);

  const [sightingFormValues, setSightingFormValues] = useState(
    getInitialFormValues(defaultSightingSchemas),
  );
  const [
    customSightingFormValues,
    setCustomSightingFormValues,
  ] = useState(getInitialFormValues(customSightingSchemas));
  const [encounterFormValues, setEncounterFormValues] = useState(
    getInitialFormValues(defaultEncounterSchemas),
  );
  const [
    customEncounterFormValues,
    setCustomEncounterFormValues,
  ] = useState(getInitialFormValues(customEncounterSchemas));

  // const locationSuggestion = useMemo(
  //   () => getLocationSuggestion(exifData),
  //   [exifData],
  // );

  const showErrorAlertBox =
    incompleteFields.length > 0 ||
    termsError ||
    putError ||
    locationFieldError ||
    dateDurationError ||
    dateOrderError;

  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <FieldCollections
        formValues={sightingFormValues}
        setFormValues={setSightingFormValues}
        categories={defaultSightingCategories}
        fieldSchema={defaultSightingSchemas}
      />
      <FieldCollections
        formValues={customSightingFormValues}
        setFormValues={setCustomSightingFormValues}
        categories={customSightingCategories}
        fieldSchema={customSightingCategories}
      />
      {variant === 'one' && (
        <>
          <FieldCollections
            formValues={encounterFormValues}
            setFormValues={setEncounterFormValues}
            categories={defaultEncounterCategories}
            fieldSchema={defaultEncounterSchemas}
          />
          <FieldCollections
            formValues={customEncounterFormValues}
            setFormValues={setCustomEncounterFormValues}
            categories={customEncounterCategories}
            fieldSchema={customEncounterSchemas}
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
            <Text
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
              <Text component="span" id="TERMS_CHECKBOX_1" />
              <InlineButton onClick={() => setDialogOpen(true)}>
                <Text component="span" id="TERMS_CHECKBOX_2" />
              </InlineButton>
              <Text component="span" id="END_OF_SENTENCE" />
            </span>
          }
        />
      </Grid>
      {showErrorAlertBox && (
        <Grid item style={{ marginBottom: 12 }}>
          <Alert severity="error">
            <AlertTitle>
              <Text id="SUBMISSION_ERROR" />
            </AlertTitle>
            {dateOrderError && (
              <Text variant="body2" id="DATE_ORDER_ERROR" />
            )}
            {dateDurationError && (
              <Text variant="body2" id="DATE_DURATION_ERROR" />
            )}
            {putError && <Text variant="body2">{putError}</Text>}
            {termsError && <Text variant="body2" id="TERMS_ERROR" />}
            {locationFieldError && (
              <Text variant="body2" id="LOCATION_FIELD_ERROR" />
            )}
            {incompleteFields.map(incompleteField => (
              <p
                style={{ margin: '4px 0' }}
                key={incompleteField.name}
              >
                <Text
                  variant="body2"
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
          onClick={async () => {
            // check that required fields are complete
            const nextIncompleteFields = defaultSightingSchemas.filter(
              field =>
                field.required &&
                field.defaultValue === sightingFormValues[field.name],
            );
            setIncompleteFields(nextIncompleteFields);

            // check that terms and conditions were accepted
            setTermsError(!acceptedTerms);

            let startTimeAfterEndTime = false;
            let durationAcceptable = true;
            // check that startTime is before endTime and duration < 24hrs
            if (
              sightingFormValues.startTime &&
              sightingFormValues.endTime
            ) {
              startTimeAfterEndTime = isAfter(
                sightingFormValues.startTime,
                sightingFormValues.endTime,
              );
              setDateOrderError(startTimeAfterEndTime);

              if (!startTimeAfterEndTime)
                durationAcceptable = isWithinInterval(
                  sightingFormValues.endTime,
                  {
                    start: sightingFormValues.startTime,
                    end: addHours(sightingFormValues.startTime, 24),
                  },
                );
              setDateDurationError(!durationAcceptable);
            }

            // check that at least one location field is present
            const oneLocationFieldPresent =
              sightingFormValues.locationId ||
              sightingFormValues.verbatimLocality ||
              get(sightingFormValues, ['gps', 0]);
            setLocationFieldError(!oneLocationFieldPresent);

            const formValid =
              nextIncompleteFields.length === 0 &&
              acceptedTerms &&
              durationAcceptable &&
              oneLocationFieldPresent &&
              !startTimeAfterEndTime;

            if (formValid) {
              const report =
                variant === 'one'
                  ? prepareReport(
                      sightingFormValues,
                      customSightingFormValues,
                      assetReferences,
                      encounterFormValues,
                      customEncounterFormValues,
                    )
                  : prepareReport(
                      sightingFormValues,
                      customSightingFormValues,
                      assetReferences,
                    );
              const newSightingId = await putSighting(report);
              if (newSightingId) {
                history.push(`/report/success/${newSightingId}`);
              }
            }
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
