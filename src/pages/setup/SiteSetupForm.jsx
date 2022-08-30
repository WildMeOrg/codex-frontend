import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import Text from '../../components/Text';
import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSetting from '../../models/site/usePutSiteSetting';
import LabeledInput from '../../components/LabeledInput';

const newSettingFields = [
  'site.name',
  'site.private',
  'site.look.themeColor',
  'site.general.tagline',
  'site.general.taglineSubtitle',
  'site.general.description',
];

const SettingInput = function ({
  customFieldCategories,
  schema,
  ...rest
}) {
  return <LabeledInput schema={schema} {...rest} />;
};

export default function SiteSetupForm({ primaryButtonId }) {
  const {
    data: newSiteSettings,
    dataUpdatedAt: siteSettingsTimestamp,
  } = useSiteSettings();
  const {
    mutate: putSiteSetting,
    error: putSiteSettingError,
    clearError: clearPutSiteSettingError,
    success,
    clearSuccess,
  } = usePutSiteSetting();

  const [currentValues, setCurrentValues] = useState(null);
  const [formErrorId, setFormErrorId] = useState(null);

  useEffect(() => {
    const edmValues = newSettingFields.map(fieldKey =>
      get(newSiteSettings, [fieldKey, 'value']),
    );
    setCurrentValues(zipObject(newSettingFields, edmValues));
  }, [siteSettingsTimestamp]);

  const customFieldCategories = get(
    newSiteSettings,
    ['data', 'site.custom.customFieldCategories', 'value'],
    [],
  );

  return (
    <Grid container direction="column" style={{ marginTop: 40 }}>
      {newSettingFields.map(settingKey => {
        const matchingSetting = get(newSiteSettings, settingKey);
        const valueIsDefined =
          get(currentValues, settingKey, undefined) !== undefined;

        return (
          <Grid
            key={settingKey}
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
                  <Text
                    style={{
                      marginTop: 20,
                    }}
                    variant="subtitle1"
                  >
                    <FormattedMessage id={matchingSetting.labelId} />
                    {matchingSetting.required && ' *'}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                    }}
                    id={matchingSetting.descriptionId}
                  />
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
                  customFieldCategories={customFieldCategories}
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
      <Grid
        item
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 28,
        }}
      >
        {Boolean(putSiteSettingError) && (
          <CustomAlert
            onClose={clearPutSiteSettingError}
            severity="error"
            titleId="SUBMISSION_ERROR"
          >
            {putSiteSettingError}
          </CustomAlert>
        )}
        {Boolean(formErrorId) && (
          <CustomAlert
            onClose={() => setFormErrorId(null)}
            severity="error"
            titleId="SUBMISSION_ERROR"
            descriptionId={formErrorId}
          />
        )}
        {success && (
          <CustomAlert
            onClose={clearSuccess}
            severity="success"
            titleId="SUCCESS"
            descriptionId="CHANGES_SAVED"
          />
        )}
        <Button
          onClick={() => {
            setFormErrorId(null);
            clearPutSiteSettingError();
            clearSuccess();

            if (currentValues['site.name'] === '') {
              setFormErrorId('SITE_NAME_IS_REQUIRED');
            } else {
              putSiteSetting({
                property: '',
                data: {
                  ...currentValues,
                  'site.needsSetup': false,
                },
              });
            }
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
