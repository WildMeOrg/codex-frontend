import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { addHours, isWithinInterval, isAfter } from 'date-fns';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import CustomAlert from '../../components/Alert';
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
import TermsAndConditionsDialog from '../../components/report/TermsAndConditionsDialog';
import {
  prepareBasicReport,
  prepareReportWithEncounter,
} from './utils/prepareReport';
import { deriveCustomFieldCategories } from './utils/customFieldUtils';
import FieldCollections from './FieldCollections';

function getInitialFormValues(schema) {
  return schema.reduce((memo, field) => {
    const valueKey = get(field, 'name');
    memo[valueKey] = get(field, 'defaultValue');
    return memo;
  }, {});
}

export default function ReportForm({
  assetReferences,
  // exifData,
}) {
  const intl = useIntl();
  const history = useHistory();
  const {
    data: siteSettingsData,
    siteSettingsVersion,
  } = useSiteSettings();
  const { loading, error: putError, putSighting } = usePutSighting();
  const [sightingType, setSightingType] = useState(null);

  const {
    customEncounterCategories,
    customSightingCategories,
  } = useMemo(
    () => {
      const _customEncounterCategories = deriveCustomFieldCategories(
        siteSettingsData,
        'encounter',
      );

      const _customSightingCategories = deriveCustomFieldCategories(
        siteSettingsData,
        'sighting',
      );

      return {
        customEncounterCategories: _customEncounterCategories,
        customSightingCategories: _customSightingCategories,
      };
    },
    [siteSettingsData, siteSettingsVersion],
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const [dateOrderError, setDateOrderError] = useState(false);
  const [dateDurationError, setDateDurationError] = useState(false);
  const [locationFieldError, setLocationFieldError] = useState(false);

  const [sightingFormValues, setSightingFormValues] = useState({});
  const [
    customSightingFormValues,
    setCustomSightingFormValues,
  ] = useState({});
  const [encounterFormValues, setEncounterFormValues] = useState({});
  const [
    customEncounterFormValues,
    setCustomEncounterFormValues,
  ] = useState({});

  useEffect(
    () => {
      const initialDefaultSightingFormValues = getInitialFormValues(
        defaultSightingSchemas,
      );
      const initialCustomSightingFormValues = getInitialFormValues(
        customSightingSchemas,
      );
      const initialDefaultEncounterFormValues = getInitialFormValues(
        defaultEncounterSchemas,
      );
      const initialCustomEncounterFormValues = getInitialFormValues(
        customEncounterSchemas,
      );
      setSightingFormValues(initialDefaultSightingFormValues);
      setCustomSightingFormValues(initialCustomSightingFormValues);
      setEncounterFormValues(initialDefaultEncounterFormValues);
      setCustomEncounterFormValues(initialCustomEncounterFormValues);
    },
    [sightingFieldSchemas, encounterFieldSchemas],
  );

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
      <FormGroup style={{ margin: '12px 0 24px 12px' }}>
        <Text
          style={{ margin: '24px 0 8px 0', fontWeight: 'bold' }}
          component="legend"
          id="SIGHTING_RADIO_QUESTION"
        />
        <RadioGroup
          aria-label="sighting-type"
          name="sightingType"
          value={sightingType}
          onChange={e => setSightingType(e.target.value)}
        >
          <FormControlLabel
            value="one"
            control={<Radio />}
            label={intl.formatMessage({
              id: 'ONE_ANIMAL',
            })}
          />
          <FormControlLabel
            value="multiple"
            control={<Radio />}
            label={intl.formatMessage({
              id: 'MULTIPLE_ANIMALS',
            })}
          />
        </RadioGroup>
      </FormGroup>
      {sightingType && (
        <>
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
            fieldSchema={customSightingSchemas}
          />
        </>
      )}
      {sightingType === 'one' && (
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
      {sightingType && (
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
      )}
      {showErrorAlertBox && (
        <Grid item style={{ marginBottom: 12 }}>
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
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
          </CustomAlert>
        </Grid>
      )}
      {sightingType ? (
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
                  field.defaultValue ===
                    sightingFormValues[field.name],
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
                  sightingType === 'one'
                    ? prepareReportWithEncounter(
                        sightingFormValues,
                        customSightingFormValues,
                        customSightingSchemas,
                        assetReferences,
                        encounterFormValues,
                        customEncounterFormValues,
                        customEncounterSchemas,
                      )
                    : prepareBasicReport(
                        sightingFormValues,
                        customSightingFormValues,
                        customSightingSchemas,
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
            id="REPORT_SIGHTING"
          />
        </Grid>
      ) : null}
    </>
  );
}
