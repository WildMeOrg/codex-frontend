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
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import DividerTitle from '../../components/DividerTitle';
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

const allSettings = [
  'Site Configuration',
  'Hero Area',
  'Site Theme',
  'Custom Card Area',
  'Email Settings',
  'Social Media Settings',
  'Twitter Configuration',
  'Muscellaneous'
];

export default function GeneralSettings() {
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

  let count = 0;

  useDocumentTitle('GENERAL_SETTINGS');

  const [showTwitterSuccess, setShowTwitterSuccess] = useState(
    twitterTestResults?.success,
  );

  useEffect(() => {
    setShowTwitterSuccess(
      twitterStatusCode !== 400 ? twitterTestResults?.success : false,
    );
  }, [twitterTestResults, twitterStatusCode]);

  const [currentValuesTemp, setCurrentValuesTemp] = useState(null);

  useEffect(() => {
    const fieldValues = allSettingsFields.map(fieldKey =>
      get(siteSettings, [fieldKey, 'value']),
    );
    setCurrentValuesTemp(zipObject(allSettingsFields, fieldValues));
  }, [siteSettings]);  

  useEffect(() => {
    if(currentValuesTemp !== null) {
      setCurrentValues(currentValuesTemp); 
    }
  }, [currentValuesTemp, setCurrentValues])

  const [ settings, setSettings ] = useState(null);

  const handleClick = (data) => {
    console.log(data);
    switch(data) {
      case 'Site Configuration' :
        console.log(1);
        setSettings(<><CustomAlert
          severity="info"
          titleId="URLS_MUST_INCLUDE_HTTPS"
        />

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
        /></>)
        break;

      case 'Hero Area' :  
      console.log(2);   
        setSettings(<>
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
        /></>)
        break;

      case 'Site Theme' :  
        console.log(3);   
        setSettings(<>
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
        /></>)  
        break;

      case "Email Settings":
        console.log(4);   

        setSettings(<>
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
        </>)  
        break;
      case "Social Media Settings":
        console.log(5);   

        setSettings(<>
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
        </>)
        break;
      default:
        console.log("default");
        setSettings(<>
          <SettingsTextInput
            settingKey="site.name"
            customFieldCategories={[]}
            currentValues={currentValues}
            setCurrentValues={setCurrentValues}
            siteSettings={siteSettings}
          />
        </>);  
      }
  }

  return (
    
    <div >      
      <Paper
                style={{        
                  padding: '24px 16px',
                  position: 'absolute',
                  width: '20%',
                  left: '10%',
                  top:100,
                  bottom: 400,
                  background: '#FFFFFF',
                  boxShadow: '0, 4, 60, rgba(0,0,0,0.08)',
                  borderRadius: 16
                }}
              >
              <Typography 
                style={{
                  marginBottom: 20 }} 
                >
                Customization Control Center
                </Typography>  
                {
                  allSettings.map(data => {
                    return (
                      <div 
                        key = {count++} 
                        onClick = { () => handleClick(data)}
                        >
                        <Link                           
                          href = "#" 
                          style={{ 
                            display: 'flex', 
                            marginBottom: '10%' 
                            }}>
                          <Box style={
                            {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              pointer: 'cursor',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#7562C6',
                              backgroundColor: '#F3F1FE',
                              color: 'white',
                              marginBottom: '5px',
                              marginRight: '10px'
                            }
                          }>{count}</Box>
                          <Text>{data}</Text>                          
                        </Link>
                        </div>
                    )
                    
                  })
                }
                
              </Paper>
      <Paper
      style={{                  
        padding: '24px 16px',
        position: 'absolute',
        width: '59%',
        left: 'calc(10% + 20% + 1%)',
        top:100,
        bottom: 400,
        background: '#FFFFFF',
        boxShadow: '0, 4, 60, rgba(0,0,0,0.08)',
        borderRadius: 16
      }}
            >     
        <div> 
          <Grid
            container
            direction="column"
            style={{ marginTop: 20, padding: 20 }}
          >
              
             {
              settings ? settings : <p>123</p>            
             }
           
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
          </Grid>
    </div> 
      </Paper>
    
    </div>    
  );
}
