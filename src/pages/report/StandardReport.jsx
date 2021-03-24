import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { get, values } from 'lodash-es';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import ExifIcon from '@material-ui/icons/FlashOn';

import useSiteSettings from '../../models/site/useSiteSettings';
import {
  selectSightingCategories,
} from '../../modules/sightings/selectors';
import usePutSighting from '../../models/sighting/usePutSighting';
import { getLocationSuggestion } from '../../utils/exif';
import categoryTypes from '../../constants/categoryTypes';
import InputRow from '../../components/InputRow';
import Text from '../../components/Text';
import Button from '../../components/Button';
import InlineButton from '../../components/InlineButton';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';
import deriveReportSightingSchema from './utils/deriveReportSightingSchema';
import prepareReport from './utils/prepareReport';

function getCustomFields(siteSettings, property) {
  return get(
    siteSettings,
    [
      'data',
      `site.custom.customFields.${property}`,
      'value',
      'definitions',
    ],
    [],
  );
}

export default function StandardReport({
  assetReferences,
  exifData,
  variant,
  onBack,
}) {
  const intl = useIntl();
  const siteSettings = useSiteSettings();
  const { loading, error: putError, putSighting } = usePutSighting();
  const customFieldCategories = get(
    siteSettings,
    ['data', 'site.custom.customFieldCategories', 'value'],
    [],
  );
  const customEncounterFields = getCustomFields(
    siteSettings,
    'Encounter',
  );
  const customIndividualFields = getCustomFields(
    siteSettings,
    'MarkedIndividual',
  );
  const customSightingFields = getCustomFields(
    siteSettings,
    'Occurrence',
  );
  const customFields = [
    ...customEncounterFields,
    ...customIndividualFields,
    ...customSightingFields,
  ];
  const siteName = get(siteSettings, ['data', 'site.name', 'value'], '<site-name>');

  const categories = useSelector(selectSightingCategories);
  const schema = deriveReportSightingSchema(siteSettings);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [exifButtonClicked, setExifButtonClicked] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const categoryList = values(categories);

  const [formValues, setFormValues] = useState(
    schema.reduce((memo, field) => {
      memo[field.name] = field.defaultValue;
      return memo;
    }, {}),
  );

  const locationSuggestion = useMemo(
    () => getLocationSuggestion(exifData),
    [exifData],
  );

  const showErrorAlertBox =
    incompleteFields.length > 0 || termsError || putError;

  console.log(formValues);

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
      <Grid item>
        {categoryList.map(category => {
          const inputsInCategory = schema.filter(
            f => f.category === category.name,
          );

          if (variant === 'multiple' && category.individualFields)
            return null;

          const showExifData =
            category.name === 'location' &&
            locationSuggestion &&
            !exifButtonClicked;

          return (
            <div key={category.name}>
              <div style={{ marginLeft: 12 }}>
                <Text
                  variant="h6"
                  style={{ marginTop: 20 }}
                  id={category.labelId}
                />
                {category.descriptionId && (
                  <Text
                    variant="subtitle2"
                    style={{ marginBottom: 12 }}
                    id={category.descriptionId}
                  />
                )}
              </div>
              <Paper
                elevation={2}
                style={{
                  marginTop: 12,
                  marginBottom: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0px 12px 20px 12px',
                }}
              >
                {showExifData && (
                  <Alert
                    style={{ marginTop: 24 }}
                    icon={<ExifIcon />}
                    action={
                      <Button
                        display="panel"
                        size="small"
                        onClick={() => {
                          setFormValues({
                            ...formValues,
                            location: locationSuggestion,
                          });
                          setExifButtonClicked(true);
                        }}
                      >
                        <FormattedMessage id="AUTOFILL_FIELDS" />
                      </Button>
                    }
                  >
                    <AlertTitle>
                      <FormattedMessage id="IMAGE_METADATA_DETECTED" />
                    </AlertTitle>
                    <FormattedMessage id="LOCATION_METADATA_DETECTED" />
                  </Alert>
                )}
                {inputsInCategory.map(input => (
                  <InputRow
                    key={`${category.name} - ${input.name}`}
                    labelId={input.labelId}
                    descriptionId={input.descriptionId}
                    required={input.required}
                    schema={input}
                    value={formValues[input.name]}
                    onChange={value => {
                      setFormValues({
                        ...formValues,
                        [input.name]: value,
                      });
                    }}
                  />
                ))}
              </Paper>
            </div>
          );
        })}
      </Grid>
      <Grid item>
        {customFieldCategories.map(category => {
          const inputsInCategory = customFields.filter(
            customField =>
              get(customField, ['schema', 'category']) ===
              category.id,
          );

          if (
            variant === 'multiple' &&
            category.type === categoryTypes.individual
          )
            return null;

          return (
            <div key={category.name}>
              <div style={{ marginLeft: 12 }}>
                <Text variant="h6" style={{ marginTop: 20 }}>
                  {category.label}
                </Text>
              </div>
              <Paper
                elevation={2}
                style={{
                  marginTop: 20,
                  marginBottom: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {inputsInCategory.map(input => (
                  <InputRow
                    key={`${category.id} - ${input.name}`}
                    label={get(input, ['schema', 'label'])}
                    description={get(input, [
                      'schema',
                      'description',
                    ])}
                    required={input.required}
                    schema={input.schema}
                    value={null}
                    onChange={value => {
                      console.log(value);
                    }}
                  />
                ))}
              </Paper>
            </div>
          );
        })}
      </Grid>
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
            const nextIncompleteFields = schema.filter(
              field =>
                field.required &&
                field.defaultValue === formValues[field.name],
            );
            setIncompleteFields(nextIncompleteFields);

            // check that terms and conditions were accepted
            setTermsError(!acceptedTerms);

            if (true) {
            // if (nextIncompleteFields.length === 0 && acceptedTerms) {
              const report = prepareReport(variant === 'one', formValues, {});
              console.log(report);
              putSighting(report);
              // putSighting({
              //   startTime: "2020-01-01T16:20:10+03:00",
              //   endTime: "2020-02-01T16:20:10+03:00",
              //   distance: 100.1,
              //   bearing: 0.123,
              //   behavior: 'hangin',
              //   decimalLatitude: 0.001,
              //   decimalLongitude: 0.001,
              //   locationId: 'location-id-0',
              //   verbatimLocality: 'placeville',
              //   encounters: [
              //     {
              //       // assetReferences,
              //       assetReferences: [],
              //       time: '2021-21-05T00:01:59+03:00',
              //       behavior: 'sleeping',
              //       lifeStage: 'youthful',
              //       sex: 'male',
              //       locationId: 'somelocation',
              //       decimalLatitude: 0.002,
              //       decimalLongitude: 0.021,
              //     },
              //   ],
              // });
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
