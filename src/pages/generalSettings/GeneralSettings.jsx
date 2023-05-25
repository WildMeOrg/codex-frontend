import React, { useEffect, useState } from 'react';
import { get, reduce, zipObject } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePutSiteSetting from '../../models/site/usePutSiteSetting';

import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useGetTwitterbotTestResults from '../../models/site/useGetTwitterbotTestResults';
import SettingsFileUpload from '../../components/settings/SettingsFileUpload';
import SettingsTextInput from '../../components/settings/SettingsTextInput';
import IntelligentAgentSettings from './IntelligentAgentSettings';
import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
import { Paper, Link, Typography, Box } from '@material-ui/core';


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
  const allSettings = [
    'Site Configuration',
    'Hero Area',
    'Site Theme',
    'Custom Card Area',
    'Email Settings',
    'Social Media Settings',
    'Twitter Configuration',
    'Miscellaneous'
  ];  

  

  const { data: siteSettings } = useSiteSettings();
  const [currentValues, setCurrentValues] = useState(null);

  const [
    intelligentAgentFieldsValid,
    setIntelligentAgentFieldsValid,
  ] = useState(false);
  const isTwitterEnabled = Boolean(
    get(currentValues, 'intelligent_agent_twitterbot_enabled'),
  );

  const {
    mutate: putSiteSetting,
    error: putSiteSettingError,
    loading: putSiteSettingLoading,
    success: putSiteSettingSuccess,
    clearSuccess: clearPutSiteSettingSuccess,
  } = usePutSiteSetting();

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
    const fieldValues = allSettingsFields.map(fieldKey =>
      get(siteSettings, [fieldKey, 'value']),
    );
    setCurrentValues(zipObject(allSettingsFields, fieldValues));
  }, [siteSettings]);

  function handleFileChange(settingKey, data) {
    setCurrentValues(prev => ({ ...prev, [settingKey]: data }));
  }

  const [ SiteConfiguration, setSiteConfiguration ] = useState(true);
  const [ HeroArea, setHeroArea ] = useState(false);
  const [ SiteTheme, setSiteTheme ] = useState(false);
  const [ CustomCardArea, setCustomCardArea ] = useState(false);
  const [ EmailSettings, setEmailSettings ] = useState(false);
  const [ SocialMediaSettings, setSocialMediaSettings ] = useState(false);
  const [ TwitterConfiguration, setTwitterConfiguration ] = useState(false);
  const [ Miscellaneous, setMiscellaneous ] = useState(false);

  const [selectedLink, setSelectedLink ] = useState('site_configuration');

  const handleClick = (data) => {
    setSelectedLink(data);
    setSiteConfiguration(data === 'site_configuration');
    setHeroArea(data === 'hero_area');
    setSiteTheme(data === 'site_theme');
    setCustomCardArea(data === 'custom_card_area');
    setEmailSettings(data === 'email_settings');
    setSocialMediaSettings(data === 'social_media_settings');
    setTwitterConfiguration(data === 'twitter_configuration');
    setMiscellaneous(data === 'miscellaneous');
  }

  let count = 0;

  return (    
      <Grid
      container
      direction="row"
      spacing={1}
      style={{ marginTop: 100, padding: '20px 6vw' }}
      >
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper style={{padding:20, minHeight: 700, maxWidth: 335, borderRadius: 16}}>
            <Typography 
                style={{
                  marginBottom: 20,
                }} 
                variant="h6"
                >
                {'Customization Control Center'}
            </Typography>  
                {
                  allSettings.map(data => {
                    const setting = data.toLocaleLowerCase().replace(/\s/g, '_');
                    return (
                      <div 
                        key = {count++} 
                        onClick = { () => {
                          handleClick(setting);                                                
                        }}
                        >
                        <Link                           
                          href = "#" 
                          style={{ 
                            display: 'flex', 
                            marginBottom: '10%',
                            textDecoration: 'none', 
                            }}>
                          <Box style={
                            {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              pointer: 'cursor',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              backgroundColor: selectedLink == setting ? '#7562C6' : '#F3F1FE',
                              color: selectedLink == setting ?'white' : '#2B2351',
                              marginBottom: '5px',
                              marginRight: '10px',
                              fontSize: '16px',
                            }
                          }>{count}</Box>
                          <Typography variant='body1' style={{color: '#2B2351'}} >{data}</Typography>                          
                        </Link>
                        </div>
                    )
                    
                  })
                }
      </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={9}>
      <Paper style={{
        padding:20, 
        overflow:"auto", 
        minHeight: 700, 
        minWidth: 500,
        maxWidth: 900,
        borderRadius: 16}}>
      {
              SiteConfiguration && 
              <>
              <SettingsBreadcrumbs currentPageTextId="SITE_CONFIGURATION" />
              <br/>
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
                settingKey="site.general.description"
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                siteSettings={siteSettings}
              />
              {/* <SettingsTextInput
                settingKey="site.private"
                customFieldCategories={[]}
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                siteSettings={siteSettings}
              /> */}
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
                <SettingsBreadcrumbs currentPageTextId="HERO_AREA" />
                <br/>
                <CustomAlert
                  severity="info"
                  titleId="URLS_MUST_INCLUDE_HTTPS"
                />
                <SettingsTextInput
                  settingKey="site.general.tagline"
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.taglineSubtitle"
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
              </>
             }
             {
              SiteTheme && <>
                <SettingsBreadcrumbs currentPageTextId="SITE_THEME" />
                <br/>
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
                <SettingsBreadcrumbs currentPageTextId="CUSTOM_CARD_AREA" />
                <br/>
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
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.customCardLine2"
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.customCardButtonText"
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                />
                <SettingsTextInput
                  settingKey="site.general.customCardButtonUrl"
                  currentValues={currentValues}
                  setCurrentValues={setCurrentValues}
                  siteSettings={siteSettings}
                />
              </>
             }
             {
              EmailSettings && <>
                 <SettingsBreadcrumbs currentPageTextId="EMAIL_SETTINGS" />
                 <br/>
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
                <SettingsBreadcrumbs currentPageTextId="SOCIAL_MEDIA_SETTINGS" />
                <br/>
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
              
              </>
             }
             {
              TwitterConfiguration && <>
              <SettingsBreadcrumbs currentPageTextId="TWITTER_CONFIGURATION" />
              <br/>
              <CustomAlert
                severity="info"
                titleId="URLS_MUST_INCLUDE_HTTPS"
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
              {twitterTestError && isTwitterEnabled && (
                <CustomAlert
                  severity="warning"
                  titleId="TWITTERBOT_NOT_CONFIGURED"
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

              </>
             }
             {
              Miscellaneous && <>
              <SettingsBreadcrumbs currentPageTextId="MUSCELLANEOUS" />
              <br/>
              <CustomAlert
                severity="info"
                titleId="URLS_MUST_INCLUDE_HTTPS"
              />
              <SettingsTextInput
                settingKey="site.general.helpDescription"
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                siteSettings={siteSettings}
              />
              <SettingsTextInput
                settingKey="site.general.donationButtonUrl"
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                siteSettings={siteSettings}
              />
                <Grid item
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
              
              {putSiteSettingSuccess && (
                <CustomAlert
                  onClose={clearPutSiteSettingSuccess}
                  severity="success"
                  titleId="SUCCESS"
                  descriptionId="CHANGES_SAVED"
                  style={{ marginBottom: 16 }}
                />
              )}

            <Grid container alignItems="center" justify="space-between" style={{ marginTop: 28 }}>
              <Grid item>
                <Button style={{ marginTop: 12 }} display="primary">
                  Previous
                </Button>
              </Grid>
              <Grid item>
                <Button style={{ marginTop: 12 }} display="primary">
                  Next
                </Button>
              </Grid>
            </Grid>         
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
      </Grid>
    // </MainColumn>
    
  );
}