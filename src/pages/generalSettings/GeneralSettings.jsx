import React, { useEffect, useState } from 'react';
import { get, reduce, zipObject } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';
import usePostSettingsAsset from '../../models/site/usePostSettingsAsset';

import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import DividerTitle from '../../components/DividerTitle';
import SettingsFileUpload from '../../components/settings/SettingsFileUpload';
import SettingsTextInput from '../../components/settings/SettingsTextInput';
import IntelligentAgentSettings from './IntelligentAgentSettings';
import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';

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

const intelligentAgentSettingsFields = reduce(
  intelligentAgentSchema,
  (memo, intelligentAgent) => {
    const platformName = get(Object.keys(intelligentAgent), [0]);
    const currentPlatformFields = get(
      intelligentAgent,
      [platformName, 'fields'],
      [],
    );
    const platformValues = Object.values(currentPlatformFields);
    console.log('deleteMe platformValues are: ');
    console.log(platformValues);

    return [...memo, ...Object.keys(platformValues)];
  },
  [],
);
console.log('deleteMe intelligentAgentSettingsFields are: ');
console.log(intelligentAgentSettingsFields);

const allSettingsFields = [
  ...generalSettingsFields,
  ...intelligentAgentSettingsFields,
];
console.log('deleteMe allSettingsFields are: ');
console.log(allSettingsFields);

// TODO deleteMe
// const intelligentAgentSettingsFields = reduce(
//   intelligentAgentSchema,
//   (memo, intelligentAgent) => {
//     const platformName = get(Object.keys(intelligentAgent), [0]);
//     const currentPlatformFields = get(
//       intelligentAgent,
//       [platformName, 'fields'],
//       [],
//     );
//     return [...memo, ...Oject.keys(currentPlatformFields)];
//   },
//   [],
// );
// console.log('deleteMe intelligentAgentSettingsFields are: ');
// console.log(intelligentAgentSettingsFields);

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
  const [allValid, setAllValid] = useState(false);
  console.log('deleteMe currentValues is: ');
  console.log(currentValues);

  const edmValues = allSettingsFields.map(fieldKey =>
    get(siteSettings, ['data', fieldKey, 'value']),
  );
  useEffect(() => {
    console.log('deleteMe currentValues in useEffect is: ');
    console.log(currentValues);
    setCurrentValues(zipObject(allSettingsFields, edmValues));
  }, edmValues);

  const loading = assetPostLoading || formPostLoading;
  const error = putSiteSettingsError || settingsAssetPostError;
  const success = formPostSuccess && !error && !loading;
  // // TODO generalize
  // const twitterBotDisabled =
  //   get(currentValues, 'intelligent_agent_twitterbot_enabled') ===
  //   'false';
  // // TODO generalize
  // const twitterBotEnabledAndNoCredsMissing =
  //   get(currentValues, 'intelligent_agent_twitterbot_enabled') ===
  //     'true' &&
  //   get(
  //     currentValues,
  //     'intelligent_agent_twitterbot_access_token',
  //   ) !== '' &&
  //   get(
  //     currentValues,
  //     'intelligent_agent_twitterbot_access_token_secret',
  //   ) !== '' &&
  //   get(
  //     currentValues,
  //     'intelligent_agent_twitterbot_bearer_token',
  //   ) !== '' &&
  //   get(
  //     currentValues,
  //     'intelligent_agent_twitterbot_consumer_key',
  //   ) !== '' &&
  //   get(
  //     currentValues,
  //     'intelligent_agent_twitterbot_consumer_secret',
  //   ) !== '';
  // const allValid =
  //   twitterBotDisabled || twitterBotEnabledAndNoCredsMissing;

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
        <SettingsTextInput
          settingKey="intelligent_agent_twitterbot_enabled"
          customFieldCategories={[]}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <IntelligentAgentSettings
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
          setAllValid={setAllValid}
        />

        {/* {get(
          currentValues,
          'intelligent_agent_twitterbot_enabled',
        ) === 'true' && (
          <>
            <SettingsTextInput
              settingKey="intelligent_agent_twitterbot_consumer_key"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
              skipDescription
            />
            <SettingsTextInput
              settingKey="intelligent_agent_twitterbot_consumer_secret"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
              skipDescription
            />
            <SettingsTextInput
              settingKey="intelligent_agent_twitterbot_access_token"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
              skipDescription
            />
            <SettingsTextInput
              settingKey="intelligent_agent_twitterbot_access_token_secret"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
              skipDescription
            />
            <SettingsTextInput
              settingKey="intelligent_agent_twitterbot_bearer_token"
              customFieldCategories={[]}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
              siteSettings={siteSettings}
              skipDescription
            />
          </>
        )} */}
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
              console.log(
                'deleteMe currentValues before posting are: ',
              );
              console.log(currentValues);
              putSiteSettings({ currentValues });
              if (logoPostData) postSettingsAsset(logoPostData);
            }}
            style={{ marginTop: 12 }}
            display="primary"
            loading={loading}
            disabled={!allValid}
            id="SAVE_CHANGES"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
