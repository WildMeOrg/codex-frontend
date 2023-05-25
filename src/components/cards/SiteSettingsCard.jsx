import React from 'react';
import { range } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Paper, Link, Typography, Box } from '@material-ui/core';

import Button from '../Button';
import Text from '../Text';
import Card from './Card';
import Grid from '@material-ui/core/Grid';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import CustomAlert from '../../components/Alert';
import SettingsFileUpload from '../settings/SettingsFileUpload';
import SettingsTextInput from '../settings/SettingsTextInput';
import { get, reduce, zipObject } from 'lodash-es';



export default function SiteSettingsCard({
  title,
  titleId,
  data,
  SiteConfiguration,
  SiteTheme,
  HeroArea,
  CustomCardArea,
  EmailSettings,
  SocialMediaSettings,
  TwitterConfiguration,
  Muscellaneous,
  currentValues,
  setCurrentValues,
  siteSettings,
  newCurrentValues,
  setNewCurrentValues
}) {

  return (
    <Grid item xs={12} sm={6} md={8}>
      <Paper style={{padding:20, overflow:"auto", minHeight: 700}}>
      {
              SiteConfiguration && 
              <>
              <SettingsBreadcrumbs currentPageTextId="Site_Configuration" />
              <CustomAlert
                severity="info"
                titleId="URLS_MUST_INCLUDE_HTTPS"
              /> 
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
              </>
             }
             {
              HeroArea && <>
                <SettingsBreadcrumbs currentPageTextId="Hero_Area" />
                <CustomAlert
                  severity="info"
                  titleId="URLS_MUST_INCLUDE_HTTPS"
                />
                <SettingsTextInput
                  settingKey="site.general.tagline"
                  currentValues={newCurrentValues}
                  setCurrentValues={setNewCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.taglineSubtitle"
                  currentValues={newCurrentValues}
                  setCurrentValues={setNewCurrentValues}
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
              </>
             }
             {
              SiteTheme && <>
                <SettingsBreadcrumbs currentPageTextId="Site_Theme" />
                <CustomAlert
                  severity="info"
                  titleId="URLS_MUST_INCLUDE_HTTPS"
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
                  onSetPostData={fileUploadData => {
                    setCurrentValues(prev => ({
                      ...prev,
                      logo: fileUploadData,
                    }));
                  }}
                />
                <SettingsTextInput
                  settingKey="site.look.logoIncludesSiteName"
                  customFieldCategories={[]}
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                />
              </>
             }
             {
              CustomCardArea && <> 
                <SettingsBreadcrumbs currentPageTextId="Custom_Card_Area" />
                  <CustomAlert
                    severity="info"
                    titleId="URLS_MUST_INCLUDE_HTTPS"
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
                  currentValues={newCurrentValues}
                  setCurrentValues={setNewCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.customCardLine2"
                  currentValues={newCurrentValues}
                  setCurrentValues={setNewCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.customCardButtonText"
                  currentValues={newCurrentValues}
                  setCurrentValues={setNewCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.customCardButtonUrl"
                  currentValues={newCurrentValues}
                  setCurrentValues={setNewCurrentValues}
                  siteSettings={siteSettings}
                />
              </>
             }
             {
              EmailSettings && <>
                 <SettingsBreadcrumbs currentPageTextId="Email_Settings" />
                  <CustomAlert
                    severity="info"
                    titleId="URLS_MUST_INCLUDE_HTTPS"
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
              </>
             }

             {
              SocialMediaSettings && <>
                <SettingsBreadcrumbs currentPageTextId="Social_Media_Settings" />
                <CustomAlert
                  severity="info"
                  titleId="URLS_MUST_INCLUDE_HTTPS"
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
              
              </>
             }
             {
              TwitterConfiguration && <>
              <SettingsBreadcrumbs currentPageTextId="Twitter_Configuration" />
                <CustomAlert
                  severity="info"
                  titleId="URLS_MUST_INCLUDE_HTTPS"
                />

              </>
             }
             {
              Muscellaneous && <>
              <SettingsBreadcrumbs currentPageTextId="Muscellaneous" />
                <CustomAlert
                  severity="info"
                  titleId="URLS_MUST_INCLUDE_HTTPS"
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
              {putSiteSettingError && (
                <CustomAlert
                  severity="error"
                  titleId="SUBMISSION_ERROR"
                  style={{ marginBottom: 16 }}
                >
                  {putSiteSettingError}
                </CustomAlert>
              )}
              {twitterTestError && isTwitterEnabled && (
                <CustomAlert
                  severity="warning"
                  titleId="TWITTERBOT_NOT_CONFIGURED"
                  style={{ marginBottom: 16 }}
                />
              )}
              {putSiteSettingSuccess && (
                <CustomAlert
                  onClose={clearPutSiteSettingSuccess}
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
                  putSiteSetting({ property: '', data: currentValues });
                }}
                style={{ marginTop: 12 }}
                display="primary"
                loading={putSiteSettingLoading}
                disabled={!intelligentAgentFieldsValid}
                id="SAVE_CHANGES"
              />
            </Grid>
              </>
             }
      </Paper>
      </Grid>
  );
}
