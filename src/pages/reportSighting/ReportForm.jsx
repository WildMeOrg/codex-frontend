import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { useHistory } from 'react-router-dom';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import CustomAlert from '../../components/Alert';
// import ExifIcon from '@material-ui/icons/FlashOn';

import {
  defaultSightingCategories,
  defaultEncounterCategories,
} from '../../constants/fieldCategories';
import usePostAssetGroup from '../../models/assetGroup/usePostAssetGroup';
import useSiteSettings from '../../models/site/useSiteSettings';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import useEncounterFieldSchemas from '../../models/encounter/useEncounterFieldSchemas';
// import { getLocationSuggestion } from '../../utils/exif';
import Button from '../../components/Button';
import Text from '../../components/Text';
import RadioChoice from '../../components/RadioChoice';
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

const radioChoices = [
  {
    labelId: 'ONE_ANIMAL',
    value: 'one',
  },
  {
    labelId: 'MULTIPLE_ANIMALS',
    value: 'multiple',
  },
];

export default function ReportForm({
  authenticated,
  assetReferences,
  // exifData,
}) {
  const intl = useIntl();
  const history = useHistory();
  const { data: siteSettingsData } = useSiteSettings();
  const recaptchaPublicKey = get(siteSettingsData, [
    'recaptchaPublicKey',
    'value',
  ]);

  const [sightingType, setSightingType] = useState(null);

  const { customEncounterCategories, customSightingCategories } =
    useMemo(() => {
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
    }, [siteSettingsData]);

  const sightingFieldSchemas = useSightingFieldSchemas();
  const encounterFieldSchemas = useEncounterFieldSchemas();

  const {
    defaultSightingSchemas,
    customSightingSchemas,
    defaultEncounterSchemas,
    customEncounterSchemas,
  } = useMemo(() => {
    const _defaultSightingSchemas = sightingFieldSchemas.filter(
      schema => !schema.customField,
    );
    const _customSightingSchemas = sightingFieldSchemas.filter(
      schema => schema.customField,
    );

    const visibleEncounterFieldSchemas = encounterFieldSchemas.filter(
      schema => !schema.hideOnBasicReport,
    );
    const _defaultEncounterSchemas =
      visibleEncounterFieldSchemas.filter(
        schema => !schema.customField,
      );
    const _customEncounterSchemas =
      visibleEncounterFieldSchemas.filter(
        schema => schema.customField,
      );

    return {
      defaultSightingSchemas: _defaultSightingSchemas,
      customSightingSchemas: _customSightingSchemas,
      defaultEncounterSchemas: _defaultEncounterSchemas,
      customEncounterSchemas: _customEncounterSchemas,
    };
  }, [sightingFieldSchemas, encounterFieldSchemas]);

  const [acceptedTerms, setAcceptedTerms] = useState(authenticated);
  // const [exifButtonClicked, setExifButtonClicked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const [formErrorId, setFormErrorId] = useState(null);

  const [sightingFormValues, setSightingFormValues] = useState({});
  const [customSightingFormValues, setCustomSightingFormValues] =
    useState({});
  const [encounterFormValues, setEncounterFormValues] = useState({});
  const [customEncounterFormValues, setCustomEncounterFormValues] =
    useState({});

  useEffect(() => {
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
  }, [
    customEncounterSchemas,
    customSightingSchemas,
    defaultEncounterSchemas,
    defaultSightingSchemas,
    sightingFieldSchemas,
    encounterFieldSchemas,
  ]);

  // const locationSuggestion = useMemo(
  //   () => getLocationSuggestion(exifData),
  //   [exifData],
  // );

  const {
    postAssetGroup,
    loading: postAssetGroupLoading,
    error: postAssetGroupError,
  } = usePostAssetGroup();

  const showErrorAlertBox =
    incompleteFields.length > 0 ||
    termsError ||
    postAssetGroupError ||
    formErrorId;

  const hasSightingTypeAndNotAuthenticated =
    sightingType && !authenticated;

  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <RadioChoice
        titleId="SIGHTING_RADIO_QUESTION"
        value={sightingType}
        onChange={setSightingType}
        choices={radioChoices}
      />
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
      {hasSightingTypeAndNotAuthenticated && (
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
            {postAssetGroupError && (
              <Text variant="body2">{postAssetGroupError}</Text>
            )}
            {termsError && <Text variant="body2" id="TERMS_ERROR" />}
            {formErrorId && <Text variant="body2" id={formErrorId} />}
            {incompleteFields.map(incompleteField => (
              <Text
                key={incompleteField.name}
                variant="body2"
                id="INCOMPLETE_FIELD"
                values={{
                  fieldName: intl.formatMessage({
                    id: incompleteField.labelId,
                  }),
                }}
              />
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
              // check that required fields are complete.
              // specifiedTime field is required, but the logic and message
              // are different from the other fields
              const nextIncompleteFields =
                defaultSightingSchemas.filter(
                  field =>
                    field.required &&
                    field.defaultValue ===
                      sightingFormValues[field.name] &&
                    field.name !== 'specifiedTime',
                );
              setIncompleteFields(nextIncompleteFields);

              // check that specifiedTime fields are complete
              let nextFormErrorId = null;
              const formTimeSpecificity = get(sightingFormValues, [
                'specifiedTime',
                'timeSpecificity',
              ]);
              const formTime = get(sightingFormValues, [
                'specifiedTime',
                'time',
              ]);

              const specifiedTimeField =
                defaultSightingSchemas.find(
                  field => field.name === 'specifiedTime',
                ) || {};

              const defaultTimeSpecificity = get(specifiedTimeField, [
                'defaultValue',
                'timeSpecificity',
              ]);

              const defaultTime = get(specifiedTimeField, [
                'defaultValue',
                'time',
              ]);

              const isTimeSpecificityDefault =
                formTimeSpecificity === defaultTimeSpecificity;

              const isTimeDefault = formTime === defaultTime;

              if (
                !formTimeSpecificity ||
                isTimeSpecificityDefault ||
                !formTime ||
                isTimeDefault
              ) {
                nextFormErrorId = 'INCOMPLETE_TIME_SPECIFICITY';
              }

              setFormErrorId(nextFormErrorId);

              // check that terms and conditions were accepted
              setTermsError(!acceptedTerms);

              const formValid =
                nextIncompleteFields.length === 0 &&
                acceptedTerms &&
                !nextFormErrorId;

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
                        true,
                      )
                    : prepareBasicReport(
                        sightingFormValues,
                        customSightingFormValues,
                        customSightingSchemas,
                        assetReferences,
                        true,
                      );

                const assetGroup = {
                  description: 'Form report from user',
                  uploadType: 'form',
                  speciesDetectionModel: get(
                    report,
                    'speciesDetectionModel',
                    [],
                  ),
                  transactionId: get(assetReferences, [
                    0,
                    'transactionId',
                  ]),
                  sightings: [report],
                };

                if (window.grecaptcha) {
                  const grecaptchaReady = new Promise(resolve => {
                    window.grecaptcha.ready(() => {
                      resolve();
                    });
                  });

                  await grecaptchaReady;

                  const token = await window.grecaptcha.execute(
                    recaptchaPublicKey,
                    { action: 'submit' },
                  );
                  assetGroup.token = token;
                }

                const assetGroupData = await postAssetGroup(
                  assetGroup,
                );

                const assetGroupSightingId = get(assetGroupData, [
                  'asset_group_sightings',
                  '0',
                  'guid',
                ]);
                if (assetGroupSightingId) {
                  const relativeUrl = authenticated
                    ? `/pending-sightings/${assetGroupSightingId}`
                    : '/report/success/';
                  history.push(relativeUrl);
                }
              }
            }}
            style={{ width: 320, marginBottom: 8 }}
            loading={postAssetGroupLoading}
            display="primary"
            id="REPORT_SIGHTING"
          />
        </Grid>
      ) : null}
    </>
  );
}
