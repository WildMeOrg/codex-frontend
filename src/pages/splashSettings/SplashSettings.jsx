import React, { useEffect, useState } from 'react';
import { get, zipObject } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import usePostSettingsAsset from '../../models/site/usePostSettingsAsset';
import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSettings from '../../models/site/usePutSiteSettings';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import DividerTitle from '../../components/DividerTitle';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import Text from '../../components/Text';
import SettingsFileUpload from '../../components/settings/SettingsFileUpload';
import SettingsTextInput from '../../components/settings/SettingsTextInput';

const customFields = {
  sighting: 'site.custom.customFields.Sighting',
  encounter: 'site.custom.customFields.Encounter',
  individual: 'site.custom.customFields.Individual',
};

const newSettingFields = [
  'site.general.customCardLine1',
  'site.general.customCardLine2',
  'site.general.customCardButtonText',
  'site.general.customCardButtonUrl',
  'site.general.tagline',
  'site.general.taglineSubtitle',
  'site.general.description',
  'site.general.helpDescription',
  'site.general.donationButtonUrl',
];

export default function SplashSettings() {
  const siteSettings = useSiteSettings();
  const {
    mutate: putSiteSettings,
    loading: formPostLoading,
    error: putSiteSettingsError,
    success: formPostSuccess,
    clearSuccess: clearFormPostSuccess,
  } = usePutSiteSettings();

  const {
    mutate: postSettingsAsset,
    error: settingsAssetPostError,
    loading: assetPostLoading,
    clearSuccess: clearAssetPostSuccess,
  } = usePostSettingsAsset();

  useDocumentTitle('FRONT_PAGE');

  const [currentValues, setCurrentValues] = useState(null);
  const [splashVideoPostData, setSplashVideoPostData] =
    useState(null);
  const [splashImagePostData, setSplashImagePostData] =
    useState(null);
  const [customCardImagePostData, setCustomCardImagePostData] =
    useState(null);

  useEffect(() => {
    const edmValues = newSettingFields.map(fieldKey =>
      get(siteSettings, ['data', fieldKey, 'value']),
    );
    setCurrentValues(zipObject(newSettingFields, edmValues));
  }, [siteSettings]);

  const customFieldCategories = get(
    siteSettings,
    ['data', 'site.custom.customFieldCategories', 'value'],
    [],
  );

  const loading = assetPostLoading || formPostLoading;
  const error = putSiteSettingsError || settingsAssetPostError;
  const success = formPostSuccess && !error && !loading;

  return (
    <MainColumn>
      <Text
        variant="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="FRONT_PAGE"
      />
      <SettingsBreadcrumbs currentPageTextId="FRONT_PAGE" />
      <Grid
        container
        direction="column"
        style={{ marginTop: 20, padding: 20 }}
      >
        <DividerTitle titleId="HERO_AREA" />
        <SettingsTextInput
          settingKey="site.general.tagline"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.taglineSubtitle"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsFileUpload
          labelId="SPLASH_IMAGE"
          descriptionId="SPLASH_IMAGE_DESCRIPTION"
          changeId="CHANGE_IMAGE"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="splashImage"
          onSetPostData={setSplashImagePostData}
        />
        <SettingsFileUpload
          labelId="SPLASH_VIDEO"
          descriptionId="SPLASH_VIDEO_DESCRIPTION"
          changeId="CHANGE_VIDEO"
          allowedFileTypes={['.webm', '.mp4']}
          settingName="splashVideo"
          onSetPostData={setSplashVideoPostData}
          variant="video"
        />
        <DividerTitle
          titleId="CUSTOM_CARD_AREA"
          style={{ marginTop: 32 }}
        />
        <SettingsFileUpload
          labelId="CUSTOM_CARD_IMAGE"
          descriptionId="CUSTOM_CARD_IMAGE_DESCRIPTION"
          changeId="CHANGE_IMAGE"
          allowedFileTypes={['.jpg', '.jpeg', '.png']}
          settingName="customCardImage"
          onSetPostData={setCustomCardImagePostData}
        />
        <SettingsTextInput
          settingKey="site.general.customCardLine1"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.customCardLine2"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.customCardButtonText"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.customCardButtonUrl"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <DividerTitle titleId="MISC" style={{ marginTop: 32 }} />
        <SettingsTextInput
          settingKey="site.general.description"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.helpDescription"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
        />
        <SettingsTextInput
          settingKey="site.general.donationButtonUrl"
          customFieldCategories={customFieldCategories}
          currentValues={currentValues}
          setCurrentValues={setCurrentValues}
          siteSettings={siteSettings}
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
            <CustomAlert
              severity="error"
              titleId="SUBMISSION_ERROR"
              description={error}
            />
          )}
          {success && (
            <CustomAlert
              onClose={() => {
                clearFormPostSuccess();
                clearAssetPostSuccess();
              }}
              severity="success"
              titleId="SUCCESS"
              descriptionId="CHANGES_SAVED"
            >
              <ButtonLink
                style={{ marginTop: 12 }}
                display="panel"
                loading={loading}
                id="PREVIEW_CHANGES"
                newTab
                external
                href="/settings/front-page/preview"
              />
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
              if (splashVideoPostData)
                postSettingsAsset({ data: splashVideoPostData });
              if (splashImagePostData)
                postSettingsAsset({ data: splashImagePostData });
              if (customCardImagePostData)
                postSettingsAsset({ data: customCardImagePostData });
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
