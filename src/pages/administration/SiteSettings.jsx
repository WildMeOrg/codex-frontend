import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { get, uniqBy, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Skeleton from '@material-ui/lab/Skeleton';
import { selectSiteSettings } from '../../modules/site/selectors';
import siteSettingsSchema from '../../constants/siteSettingsSchema';
import Button from '../../components/Button';
import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';

import LabeledInput from '../../components/LabeledInput';
import FieldSetInput from '../../components/inputs/FieldSetInput';
import fieldTypes from '../../constants/fieldTypes';

const newSettingFields = [
  'site.name',
  'site.private',
  'site.general.tagline',
  'site.general.exploreTagline',
  'site.custom.regions',
];

function getFieldsetErrors(intl, fieldset, fieldsetName) {
  const noLabelFields = fieldset.filter(field => field.label === '');
  const noValueFields = fieldset.filter(field => field.label === '');
  const sameLabels =
    uniqBy(fieldset, 'label').length !== fieldset.length;
  const sameValues =
    uniqBy(fieldset, 'value').length !== fieldset.length;

  const errors = [];
  if (noLabelFields.length > 0)
    errors.push(
      intl.formatMessage(
        { id: 'CUSTOM_FIELD_NO_LABEL_ERROR' },
        { fieldsetName },
      ),
    );
  if (noValueFields.length > 0)
    errors.push(
      intl.formatMessage(
        { id: 'CUSTOM_FIELD_NO_VALUE_ERROR' },
        { fieldsetName },
      ),
    );
  if (sameLabels)
    errors.push(
      intl.formatMessage(
        { id: 'CUSTOM_FIELD_SAME_LABEL_ERROR' },
        { fieldsetName },
      ),
    );
  if (sameValues)
    errors.push(
      intl.formatMessage(
        { id: 'CUSTOM_FIELD_SAME_VALUE_ERROR' },
        { fieldsetName },
      ),
    );

  return errors;
}

/* FieldSetInput cannot be rendered by LabeledInput, this avoids a circular dependency. */
function SettingInput(props) {
  if (get(props, ['schema', 'fieldType']) === fieldTypes.fieldset) {
    return <FieldSetInput {...props} />;
  }
  return <LabeledInput {...props} />;
}

export default function SiteSettings({ primaryButtonId }) {
  const intl = useIntl();
  const siteSettings = useSelector(selectSiteSettings);
  const newSiteSettings = useSiteSettings();
  const putSiteSettings = usePutSiteSettings();

  const [currentValues, setCurrentValues] = useState(null);

  const edmValues = newSettingFields.map(fieldKey =>
    get(newSiteSettings, ['data', fieldKey, 'value']),
  );
  useEffect(() => {
    setCurrentValues(zipObject(newSettingFields, edmValues));
  }, edmValues);

  const [submissionAttempted, setSubmissionAttempted] = useState(
    false,
  );

  const [formValues, setFormValues] = useState(
    siteSettingsSchema.reduce((memo, field) => {
      memo[field.name] = siteSettings[field.name];
      return memo;
    }, {}),
  );

  const sightingErrors = getFieldsetErrors(
    intl,
    formValues.sightingFields,
    intl.formatMessage({ id: 'CUSTOM_SIGHTING_FIELD_LABEL' }),
  );
  const individualErrors = getFieldsetErrors(
    intl,
    formValues.individualFields,
    intl.formatMessage({ id: 'CUSTOM_INDIVIDUAL_FIELD_LABEL' }),
  );

  const errors = [...sightingErrors, ...individualErrors];

  return (
    <Grid container direction="column" style={{ marginTop: 40 }}>
      {newSettingFields.map(settingKey => {
        const matchingSetting = get(newSiteSettings, [
          'data',
          settingKey,
        ]);
        const valueIsDefined =
          get(currentValues, settingKey, undefined) !== undefined;
        return (
          <Grid
            key={settingKey}
            onClick={() => setSubmissionAttempted(false)}
            item
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: '35%',
              }}
            >
              {matchingSetting && valueIsDefined ? (
                <>
                  <Typography
                    style={{
                      marginTop: 20,
                    }}
                    variant="subtitle1"
                  >
                    <FormattedMessage id={matchingSetting.labelId} />
                    {matchingSetting.required && ' *'}
                  </Typography>
                  <Typography
                    style={{
                      marginTop: 4,
                    }}
                  >
                    <FormattedMessage
                      id={matchingSetting.descriptionId}
                    />
                  </Typography>
                </>
              ) : (
                <>
                  <Skeleton
                    variant="rect"
                    width="40%"
                    height={30}
                    style={{ marginTop: 20 }}
                  />
                  <Skeleton
                    variant="rect"
                    width="100%"
                    height={48}
                    style={{ marginTop: 4 }}
                  />
                </>
              )}
            </div>
            <div
              style={{
                marginTop: 24,
                marginLeft: 80,
                width: 400,
                minWidth: 400,
              }}
            >
              {matchingSetting && valueIsDefined ? (
                <SettingInput
                  schema={{
                    labelId: matchingSetting.labelId,
                    descriptionId: matchingSetting.descriptionId,
                    fieldType: matchingSetting.displayType,
                  }}
                  minimalLabels
                  value={currentValues[settingKey]}
                  onChange={value => {
                    setCurrentValues({
                      ...currentValues,
                      [settingKey]: value,
                    });
                  }}
                />
              ) : (
                <Skeleton variant="rect" width={280} height={30} />
              )}
            </div>
          </Grid>
        );
      })}
      <Divider style={{ marginTop: 20 }} />
      {siteSettingsSchema.map(settingSchema => {
        if (settingSchema.hidden) return null;

        return (
          <Grid
            onClick={() => setSubmissionAttempted(false)}
            key={settingSchema.name}
            item
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                style={{
                  marginTop: 20,
                }}
                variant="subtitle1"
              >
                <FormattedMessage id={settingSchema.labelId} />
                {settingSchema.required && ' *'}
              </Typography>
              <Typography
                style={{
                  marginTop: 4,
                }}
              >
                <FormattedMessage id={settingSchema.descriptionId} />
              </Typography>
            </div>
            <div
              style={{
                marginTop: 24,
                marginLeft: 80,
                width: 400,
                minWidth: 400,
              }}
            >
              <SettingInput
                schema={settingSchema}
                minimalLabels
                value={formValues[settingSchema.name]}
                onChange={value => {
                  setFormValues({
                    ...formValues,
                    [settingSchema.name]: value,
                  });
                }}
              />
            </div>
          </Grid>
        );
      })}
      <Grid
        item
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 28,
        }}
      >
        {submissionAttempted && (
          <div>
            {errors.map(error => (
              <Typography style={{ color: '#DC2113' }}>
                {error}
              </Typography>
            ))}
          </div>
        )}
        <Button
          onClick={() => {
            setSubmissionAttempted(true);
            putSiteSettings(currentValues);
          }}
          style={{ marginTop: 12 }}
          display="primary"
        >
          <FormattedMessage id={primaryButtonId} />
        </Button>
      </Grid>
    </Grid>
  );
}
