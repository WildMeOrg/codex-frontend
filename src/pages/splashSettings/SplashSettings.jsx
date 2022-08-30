import React, { useEffect, useState } from 'react';
import { get, zipObject } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSetting from '../../models/site/usePutSiteSetting';
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
  const { dataUpdatedAt: siteSettingsTimestamp } = siteSettings;

  const {
    mutate: putSiteSetting,
    error: putSiteSettingError,
    loading: putSiteSettingLoading,
    success: putSiteSettingSuccess,
    clearSuccess: clearPutSiteSettingSuccess,
  } = usePutSiteSetting();

  useDocumentTitle('FRONT_PAGE');

  const [currentValues, setCurrentValues] = useState(null);

  useEffect(() => {
    const edmValues = newSettingFields.map(fieldKey =>
      get(siteSettings, ['data', fieldKey, 'value']),
    );
    setCurrentValues(zipObject(newSettingFields, edmValues));
  }, [siteSettingsTimestamp]);

  const customFieldCategories = get(siteSettings, [
    'data',
    'site.custom.customFieldCategories',
    'value',
  ]);

  function handleFileChange(settingKey, data) {
    setCurrentValues(prev => ({ ...prev, [settingKey]: data }));
  }

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
          onSetPostData={data =>
            handleFileChange('splashImage', data)
          }
        />
        <SettingsFileUpload
          labelId="SPLASH_VIDEO"
          descriptionId="SPLASH_VIDEO_DESCRIPTION"
          changeId="CHANGE_VIDEO"
          allowedFileTypes={['.webm', '.mp4']}
          settingName="splashVideo"
          onSetPostData={data =>
            handleFileChange('splashVideo', data)
          }
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
          onSetPostData={data =>
            handleFileChange('customCardImage', data)
          }
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
          {Boolean(putSiteSettingError) && (
            <CustomAlert
              severity="error"
              titleId="SUBMISSION_ERROR"
              description={putSiteSettingError}
            />
          )}
          {putSiteSettingSuccess && (
            <CustomAlert
              onClose={clearPutSiteSettingSuccess}
              severity="success"
              titleId="SUCCESS"
              descriptionId="CHANGES_SAVED"
            >
              <ButtonLink
                style={{ marginTop: 12 }}
                display="panel"
                loading={putSiteSettingLoading}
                id="PREVIEW_CHANGES"
                newTab
                external
                href="/settings/front-page/preview"
              />
            </CustomAlert>
          )}

          <Button
            onClick={() => {
              putSiteSetting({ property: '', data: currentValues });
            }}
            style={{ marginTop: 12 }}
            display="primary"
            loading={putSiteSettingLoading}
            id="SAVE_CHANGES"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
