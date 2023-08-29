import React, { useEffect, useState, useMemo } from 'react';
import { get, has } from 'lodash-es';

import Grid from '@material-ui/core/Grid';

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
import { useGetAllAuditLogs } from '../../models/auditLogs/useGetAuditLogs';
import Paginator from '../../components/dataDisplays/Paginator';

export default function ChangeLog() {
    
  useDocumentTitle('CHANGE_LOG');
  const theme = useTheme();  
  const intl = useIntl();

  const { data, isLoading, error } = useGetAllAuditLogs();
  console.log('data', data);

  const [searchParams, setSearchParams] = useState({
    limit: 20,
    offset: 0,
    sort: 'time',
    reverse: true,
  });

  const tableRows = data?.map((row) => {
    
    return {
      id: row.guid,
      time: row.created,
      message: `MODULE NAME: ${row.module_name}, ITEM GUID: ${row.item_guid}, AUDIT TYPE:  ${row.audit_type},  DETAILS: ${row.message}`,
    }

  })

  // module_name + item_guid + audit_type + message

  console.log('tableRows', tableRows);
  
  const tableColumns = [
    {
      name: 'time',
      label: intl.formatMessage({ id: 'TIME_CHANGE_OCCURRED' }),
      options: {
        customBodyRender: labelId => (
          <FormattedMessage id={labelId} defaultMessage={labelId}/>
        ),
      },
    },
    {
      name: 'message',
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
                display="tertiary"     
            />
        </div>
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={tableRows}
        tableContainerStyles={{ maxHeight: 700 }}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <Paginator
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        count={200}
      />
    </Grid>
    </MainColumn>
  );
}
