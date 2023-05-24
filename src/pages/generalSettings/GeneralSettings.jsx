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
const allSettings = [
  'Site Configuration']

const allSettingsFields = [
  ...generalSettingsFields,
];

export default function GeneralSettings() {
  const { data: siteSettings } = useSiteSettings();
  const [settings, setSettings] = useState(null);
  const [currentValues, setCurrentValues] = useState(null);
 
  const {
    mutate: putSiteSetting,
    error: putSiteSettingError,
    loading: putSiteSettingLoading,
    success: putSiteSettingSuccess,
    clearSuccess: clearPutSiteSettingSuccess,
  } = usePutSiteSetting();

  let count = 0;
  const [isClicked, setIsClicked] =  useState(false);
  useDocumentTitle('GENERAL_SETTINGS');

  useEffect(() => {
    const fieldValues = allSettingsFields.map(fieldKey =>
      get(siteSettings, [fieldKey, 'value']),
    );
    setCurrentValues(zipObject(allSettingsFields, fieldValues));
  }, [siteSettings]);

  const handleClick = (data) => {    
    setIsClicked(true);
  }

  return (
    // <MainColumn>
    //   <Text
    //     variant="h3"
    //     style={{ padding: '16px 0 16px 16px' }}
    //     id="GENERAL_SETTINGS"
    //   />
    //   <SettingsBreadcrumbs currentPageTextId="GENERAL_SETTINGS" />
    //   <Grid
    //     container
    //     direction="column"
    //     style={{ marginTop: 20, padding: 20 }}
    //   >
    //     <DividerTitle titleId="SITE_CONFIGURATION" />
    //     <SettingsTextInput
    //       settingKey="site.name"
    //       customFieldCategories={[]}
    //       currentValues={currentValues}
    //       setCurrentValues={setCurrentValues}
    //       siteSettings={siteSettings}
    //     />              

    //     <Grid 
    //       item
    //       style={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         marginTop: 28,
    //       }}
    //     >       
    //     {putSiteSettingError && (
    //             <CustomAlert
    //               severity="error"
    //               titleId="SUBMISSION_ERROR"
    //               style={{ marginBottom: 16 }}
    //             >
    //               {putSiteSettingError}
    //             </CustomAlert>
    //           )}              
    //           {putSiteSettingSuccess && (
    //             <CustomAlert
    //               onClose={clearPutSiteSettingSuccess}
    //               severity="success"
    //               titleId="SUCCESS"
    //               descriptionId="CHANGES_SAVED"
    //               style={{ marginBottom: 16 }}
    //             />
    //           )}    
    //       <Button
    //         onClick={() => {
    //           putSiteSetting({ property: '', data: currentValues });
    //         }}
    //         style={{ marginTop: 12 }}
    //         display="primary"
    //         loading={putSiteSettingLoading}
    //         // disabled={!intelligentAgentFieldsValid}
    //         id="SAVE_CHANGES"
    //       />
    //     </Grid>
    //   </Grid>
    // </MainColumn>
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
              isClicked && <SettingsTextInput
                settingKey="site.name"
                customFieldCategories={[]}
                currentValues={currentValues}
                setCurrentValues={setCurrentValues}
                siteSettings={siteSettings}
              />
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
              {putSiteSettingSuccess && (
                <CustomAlert
                  onClose={clearPutSiteSettingSuccess}
                  severity="success"
                  titleId="SUCCESS"
                  descriptionId="CHANGES_SAVED"
                  style={{ marginBottom: 16 }}
                />
              )}             
              <Button
                onClick={() => {
                  putSiteSetting({ property: '', data: currentValues });
                }}
                style={{ marginTop: 12 }}
                display="primary"
                loading={putSiteSettingLoading}
                // disabled={!intelligentAgentFieldsValid}
                id="SAVE_CHANGES"
              />
            </Grid>
          </Grid>
    </div> 
      </Paper>
    
    </div>  
  );
}