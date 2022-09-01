import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSetting from '../../models/site/usePutSiteSetting';
import SettingsTextInput from '../../components/settings/SettingsTextInput';

const newSettingFields = [
  'site.name',
  'site.private',
  'site.look.themeColor',
  'site.general.tagline',
  'site.general.taglineSubtitle',
  'site.general.description',
];

export default function SiteSetupForm({ primaryButtonId }) {
  const { data: newSiteSettings } = useSiteSettings();
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
    const fieldValues = newSettingFields.map(fieldKey =>
      get(newSiteSettings, [fieldKey, 'value']),
    );
    setCurrentValues(zipObject(newSettingFields, fieldValues));
  }, [newSiteSettings]);

  return (
    <Grid container direction="column" style={{ marginTop: 40 }}>
      {newSettingFields.map(settingKey => (
        <SettingsTextInput
          key={settingKey}
          settingKey={settingKey}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={newSiteSettings}
        />
      ))}
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
