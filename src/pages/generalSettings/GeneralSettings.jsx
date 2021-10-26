import React, { useEffect, useState } from 'react';
import { get, zipObject } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';
import usePostSettingsAsset from '../../models/site/usePostSettingsAsset';

import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import SettingsFileUpload from '../../components/settings/SettingsFileUpload';
import SettingsTextInput from '../../components/settings/SettingsTextInput';

const customFields = {
  sighting: 'site.custom.customFields.Occurrence',
  encounter: 'site.custom.customFields.Encounter',
  individual: 'site.custom.customFields.MarkedIndividual',
};

const generalSettingsFields = [
  'site.name',
  'site.private',
  'site.look.themeColor',
  'site.general.photoGuidelinesUrl',
  'email_service',
  // 'email_default_sender_name',
  // 'email_default_sender_email',
  'email_service_username',
  'email_service_password',
  'site.links.facebookLink',
  'site.links.instagramLink',
  'site.links.twitterLink',
  'site.look.logoIncludesSiteName',
];

export default function GeneralSettings() {
  const siteSettings = useSiteSettings();
  const {
    putSiteSettings,
    error: putSiteSettingsError,
    loading: formPostLoading,
    success: formPostSuccess,
    setSuccess: setFormPostSuccess,
  } = usePutSiteSettings();

  const {
    postSettingsAsset,
    loading: assetPostLoading,
    error: settingsAssetPostError,
    setSuccess: setAssetPostSuccess,
  } = usePostSettingsAsset();

  useDocumentTitle('GENERAL_SETTINGS');

  const [currentValues, setCurrentValues] = useState(null);
  const [logoPostData, setLogoPostData] = useState(null);

  const edmValues = generalSettingsFields.map(fieldKey =>
    get(siteSettings, ['data', fieldKey, 'value']),
  );
  useEffect(() => {
    setCurrentValues(zipObject(generalSettingsFields, edmValues));
  }, edmValues);

  const loading = assetPostLoading || formPostLoading;
  const error = putSiteSettingsError || settingsAssetPostError;
  const success = formPostSuccess && !error && !loading;

  return (
    <MainColumn>
      <Text
        variant="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="GENERAL_SETTINGS"
      />
      <ButtonLink
        href="/admin"
        style={{ marginTop: 8, width: 'fit-content' }}
        display="back"
        id="BACK"
      />
      <Grid
        container
        direction="column"
        style={{ marginTop: 20, padding: 20 }}
      >
        {generalSettingsFields.map(settingKey => (
          <SettingsTextInput
            key={settingKey}
            settingKey={settingKey}
            customFieldCategories={[]}
            currentValues={currentValues}
            setCurrentValues={setCurrentValues}
            siteSettings={siteSettings}
          />
        ))}
        <SettingsFileUpload
          labelId="LOGO"
          descriptionId="LOGO_DESCRIPTION"
          changeId="CHANGE_LOGO"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="logo"
          onSetPostData={setLogoPostData}
        />
        <Grid
          item
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 28,
          }}
        >
          {Boolean(error) && (
            <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
              {error}
            </CustomAlert>
          )}
          {success && (
            <CustomAlert
              onClose={() => {
                setFormPostSuccess(false);
                setAssetPostSuccess(false);
              }}
              severity="success"
              titleId="SUCCESS"
              descriptionId="CHANGES_SAVED"
            />
          )}
          <Button
            onClick={() => {
              /* Prepare custom fields objects to send to backend */
              Object.values(customFields).forEach(customFieldKey => {
                const fields = currentValues[customFieldKey];
                if (!fields) {
                  currentValues[customFieldKey] = { definitions: [] };
                } else {
                  const newFields = get(
                    fields,
                    'definitions',
                    [],
                  ).map(field => {
                    const choices = get(field, ['schema', 'choices']);
                    if (!choices) return field;
                    return {
                      ...field,
                      options: choices.map(choice => choice.label),
                    };
                  });

                  currentValues[customFieldKey] = {
                    definitions: newFields,
                  };
                }
              });
              putSiteSettings(currentValues);
              if (logoPostData) postSettingsAsset(logoPostData);
            }}
            style={{ marginTop: 12 }}
            display="primary"
            loading={loading}
            id="SAVE_CHANGES"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
