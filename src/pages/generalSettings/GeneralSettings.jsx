import React, { useEffect, useState } from 'react';
import { get, reduce, zipObject } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../models/site/useSiteSettings3';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';
import usePostSettingsAsset from '../../models/site/usePostSettingsAsset';

import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useGetTwitterbotTestResults from '../../models/site/useGetTwitterbotTestResults';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import DividerTitle from '../../components/DividerTitle';
import SettingsFileUpload from '../../components/settings/SettingsFileUpload';
import SettingsTextInput from '../../components/settings/SettingsTextInput';
import IntelligentAgentSettings from './IntelligentAgentSettings';
import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';

const customFields = {
  sighting: 'site.custom.customFields.Sighting',
  encounter: 'site.custom.customFields.Encounter',
  individual: 'site.custom.customFields.Individual',
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

const intelligentAgentSettingsFields = reduce(
  intelligentAgentSchema,
  (memo, intelligentAgent) => {
    const currentPlatformFields = get(
      intelligentAgent,
      ['data', 'fields'],
      [],
    );
    const platformValues = Object.values(currentPlatformFields).map(
      entry => get(entry, 'label'),
    );
    return [...memo, ...platformValues];
  },
  [],
);

const allSettingsFields = [
  ...generalSettingsFields,
  ...intelligentAgentSettingsFields,
];

export default function GeneralSettings() {
  const siteSettings = useSiteSettings();

  const [currentValues, setCurrentValues] = useState(null);
  const [logoPostData, setLogoPostData] = useState(null);
  const [
    intelligentAgentFieldsValid,
    setIntelligentAgentFieldsValid,
  ] = useState(false);
  const isTwitterEnabled = Boolean(
    get(currentValues, 'intelligent_agent_twitterbot_enabled'),
  );

  const {
    mutate: putSiteSettings,
    error: putSiteSettingsError,
    loading: formPostLoading,
    success: formPostSuccess,
    clearSuccess: setClearPostSuccess,
  } = usePutSiteSettings();

  const {
    mutate: postSettingsAsset,
    loading: assetPostLoading,
    error: settingsAssetPostError,
    clearSuccess: setClearAssetPostSuccess,
  } = usePostSettingsAsset();

  const {
    data: twitterTestResults,
    statusCode: twitterStatusCode,
    error: twitterTestError,
  } = useGetTwitterbotTestResults(isTwitterEnabled);

  useDocumentTitle('GENERAL_SETTINGS');

  const [showTwitterSuccess, setShowTwitterSuccess] = useState(
    twitterTestResults?.success,
  );

  useEffect(() => {
    setShowTwitterSuccess(
      twitterStatusCode !== 400 ? twitterTestResults?.success : false,
    );
  }, [twitterTestResults, twitterStatusCode]);

  useEffect(() => {
    const edmValues = allSettingsFields.map(fieldKey =>
      get(siteSettings, ['data', fieldKey, 'value']),
    );
    setCurrentValues(zipObject(allSettingsFields, edmValues));
  }, [siteSettings, allSettingsFields]);

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
      <SettingsBreadcrumbs currentPageTextId="GENERAL_SETTINGS" />
      <Grid
        container
        direction="column"
        style={{ marginTop: 20, padding: 20 }}
      >
        <DividerTitle titleId="SITE_CONFIGURATION" />
        <SettingsTextInput
          settingKey="site.name"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.private"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.photoGuidelinesUrl"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <DividerTitle
          titleId="SITE_THEME"
          style={{ marginTop: 32 }}
        />
        <SettingsTextInput
          settingKey="site.look.themeColor"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsFileUpload
          labelId="LOGO"
          descriptionId="LOGO_DESCRIPTION"
          changeId="CHANGE_LOGO"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="logo"
          onSetPostData={setLogoPostData}
        />
        <SettingsTextInput
          settingKey="site.look.logoIncludesSiteName"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <DividerTitle
          titleId="EMAIL_SETTINGS"
          style={{ marginTop: 32 }}
        />
        <SettingsTextInput
          settingKey="email_service"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        {get(currentValues, 'email_service') !== '' && (
          <>
            <SettingsTextInput
              settingKey="email_service_username"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
            />
            <SettingsTextInput
              settingKey="email_service_password"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
            />
          </>
        )}
        <DividerTitle
          titleId="SOCIAL_SETTINGS"
          style={{ marginTop: 32 }}
        />
        <SettingsTextInput
          settingKey="site.links.facebookLink"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.links.instagramLink"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.links.twitterLink"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <IntelligentAgentSettings
          intelligentAgentSettingsFields={
            intelligentAgentSettingsFields
          }
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
          setIntelligentAgentFieldsValid={
            setIntelligentAgentFieldsValid
          }
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
          {error && (
            <CustomAlert
              severity="error"
              titleId="SUBMISSION_ERROR"
              style={{ marginBottom: 16 }}
            >
              {error}
            </CustomAlert>
          )}
          {twitterTestError && isTwitterEnabled && (
            <CustomAlert
              severity="warning"
              titleId="TWITTERBOT_NOT_CONFIGURED"
              style={{ marginBottom: 16 }}
            />
          )}
          {success && (
            <CustomAlert
              onClose={() => {
                setClearPostSuccess();
                setClearAssetPostSuccess();
              }}
              severity="success"
              titleId="SUCCESS"
              descriptionId="CHANGES_SAVED"
              style={{ marginBottom: 16 }}
            />
          )}
          {showTwitterSuccess && (
            <CustomAlert
              onClose={() => {
                setShowTwitterSuccess(false);
              }}
              severity="info"
              titleId="TWITTERBOT_SETUP_CONFIRMATION"
            >
              {twitterTestResults?.message}
            </CustomAlert>
          )}
          <Button
            onClick={() => {
              /* Prepare custom fields objects to send to backend */
              Object.values(customFields).forEach(customFieldKey => {
                const fields = currentValues[customFieldKey];
                if (!fields) {
                  currentValues[customFieldKey] = {
                    definitions: [],
                  };
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
              putSiteSettings({ data: currentValues });
              if (logoPostData)
                postSettingsAsset({
                  data: logoPostData,
                });
            }}
            style={{ marginTop: 12 }}
            display="primary"
            loading={loading}
            disabled={!intelligentAgentFieldsValid}
            id="SAVE_CHANGES"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
