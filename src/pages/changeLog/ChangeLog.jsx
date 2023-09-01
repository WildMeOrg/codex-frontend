import React, { useEffect, useState, useMemo } from 'react';
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
import useGetAuditLogs, { useGetAllAuditLogs } from '../../models/auditLogs/useGetAuditLogs';
import useFilterAuditLogs from '../../models/auditLogs/useFilterAuditLogs';
import Paginator from '../../components/dataDisplays/Paginator';
import TextField from '@material-ui/core/TextField';
import SadScreen from '../../components/SadScreen';

export default function ChangeLog() {
    
  useDocumentTitle('CHANGE_LOG');
  const theme = useTheme();  
  const intl = useIntl();

  const [inputValue, setInputValue] = useState('');

  const rowsPerPage = 100;  
  const [searchParams, setSearchParams] = useState({
    limit: rowsPerPage,
    offset: 0,
    sort: 'time',
    reverse: true,
  });  

  const buildAndSortTableRows = (data) => {
    return data?.map((row) => {
      return {
        id: row.guid,
        time: row.created,
        message: `MODULE NAME: ${row.module_name}, ITEM GUID: ${row.item_guid}, AUDIT TYPE:  ${row.audit_type},  DETAILS: ${row.message}`,
      }
    })?.sort((a, b) => new Date(b.time) - new Date(a.time));
  }

  const [ formFilters, setFormFilters ] = useState(
    {
      "bool" : {
          "filter" : [],
      }
    }
  ); 

  const { data, isLoading, error, statusCode } = useGetAllAuditLogs();
  // const { data: searchedData, isLoading: isSearchedLoading, error: searchedError } = useGetAuditLogs(auditLogId);  
  const { data : searchedData, loading } = useFilterAuditLogs({
    queries: formFilters,
    params: searchParams,
  });

  console.log('searchedData', searchedData);
  // const searchedTableRows = searchedError ? [] : buildAndSortTableRows(searchedData);  
  const searchedTableRows = buildAndSortTableRows(searchedData?.results);  
  const tableRows = buildAndSortTableRows(data);  
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

  const buildFilters = (inputValue) => {
    if(inputValue.trim() !== '') {
      setFormFilters(
        {
          "bool" : {
             "filter" : [
                {
                       "match": {
                               "item_guid": inputValue
                       }
                }
             ]
          }
       }
    )
    } else {
      setFormFilters(
        {
          "bool" : {
             "filter" : []
          }
       }
    )

    } 

  }

  if(searchedData?.statusCode === 403) return <SadScreen
    statusCode={statusCode}
/>

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

            <div
              style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'flex-end',
                marginBottom: 12, 
              }}
            >
              <Button
                startIcon={<SearchIcon />}
                // loading={isSearchedLoading}
                onClick = { () => buildFilters(inputValue)}
                style={{ height: 30, border: 'none' }}
              >
                
              </Button>
              <TextField
                id="entity-guid-input"
                label="Entity GUID"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    buildFilters(inputValue)
                  }
                }}
                style={{ width: 420 }}
              />
              
            </div>
            
        </div>
      <DataDisplay
        style={{ marginTop: 8 }}
        noTitleBar
        variant="secondary"
        columns={tableColumns}
        data={searchedTableRows || tableRows }
        tableContainerStyles={{ maxHeight: 1000 }}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        noResultsTextId="NO_SEARCH_RESULT"
      />
      <Paginator
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        count={searchedData?.resultCount}
      />
    </Grid>
    </MainColumn>
  );
}
