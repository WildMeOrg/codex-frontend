import React, { useEffect, useState, useMemo } from 'react';
import { get, has } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import Button from '../../components/Button';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import Text from '../../components/Text';
import Link from '../../components/Link';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useTheme from '@material-ui/core/styles/useTheme';


export default function ChangeLog() {
    
  useDocumentTitle('CHANGE_LOG');
  const theme = useTheme();  

  return (
    <MainColumn>
        <Link href="/settings"                   
            style={{
            display:'flex',
            alignItems:'center',
            color: theme.palette.text.primary,
            fontSize: 32,
            fontWeight: 'bold',
            textDecoration: 'none',
            marginTop: 500,
            }}
            >  
            <ArrowBackIcon />
            {'Change Log'}  
        </Link> 
      
      {/* <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="CHANGE_LOG"
      /> */}
      <SettingsBreadcrumbs currentPageTextId="CHANGE_LOG" />
    </MainColumn>
  );
}
