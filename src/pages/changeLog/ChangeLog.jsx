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
import { useIntl, FormattedMessage } from 'react-intl';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import SearchIcon from '@material-ui/icons/Search';

export default function ChangeLog() {
    
  useDocumentTitle('CHANGE_LOG');
  const theme = useTheme();  
  const intl = useIntl();

  
  const tableColumns = [
    {
      name: 'labelId',
      label: intl.formatMessage({ id: 'TIME_CHANGE_OCCURRED' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} />
        ),
      },
    },
    {
      name: 'type',
      label: intl.formatMessage({ id: 'MESSAGE' }),
    //   options: { cellRenderer: cellRendererTypes.capitalizedString },
    },    
  ];
  

  return (
    <MainColumn>
        <Link href="/settings"                   
            style={{
            display:'flex',
            alignItems:'center',
            color: theme.palette.text.primary,
            fontSize: 22,
            fontWeight: 'bold',
            textDecoration: 'none',
            marginTop: 80,
            }}
            >  
            <ArrowBackIcon />
            {<FormattedMessage id={'CHANGE_LOG'}/>}  
        </Link> 
      
      {/* <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="CHANGE_LOG"
      /> */}
      <SettingsBreadcrumbs currentPageTextId="CHANGE_LOG" />
      
      <Grid item>   
        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            }}
        >  
            <Text
                variant="h5"
                component="h5"
                id="CHANGE_LOG"
            />
            <Button
                startIcon={<SearchIcon />}
                display="secondary"     
            />
        </div>
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        // data={configurableFields}
        tableContainerStyles={{ maxHeight: 300 }}
      />
    </Grid>
    </MainColumn>
  );
}
