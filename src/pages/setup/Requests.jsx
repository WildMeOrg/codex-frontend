import React, { useEffect, useState } from 'react';
import MainColumn from '../../components/MainColumn';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import useGetRequests from '../../models/users/useGetRequests';
import { useIntl } from 'react-intl';
import SadScreen from '../../components/SadScreen';
import LoadingScreen from '../../components/LoadingScreen';

export default function Requests() {
    const intl = useIntl();
    const {
        data,
        isLoading,
        error,
        statusCode
      } = useGetRequests();
      
    let requests = data || [];
    requests = requests.map((request) => {
      request.created = new Date(request.created).toLocaleString(); return request;})
    const columns = [
        {
          name: 'created',
          label: intl.formatMessage({ id: 'CREATED' }),
        },
        {
          name: 'name',
          label: intl.formatMessage({ id: 'NAME' }),
        },
        {
          name: 'email',
          label: intl.formatMessage({ id: 'EMAIL' }),
        },
        {
          name: 'message',
          label: intl.formatMessage({ id: 'MESSAGE' }),
        }        
      ];
  if(isLoading) return <LoadingScreen />    

  if(error) return <SadScreen
      statusCode={statusCode}
/>
  return (
    <MainColumn style={{
        display: 'flex', 
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        }}>
      <h1>Manage Requests</h1>
      <Card>
        <CardContent>
          <Text id="INVITATION_REQUESTS" style={{ fontWeight: 'bold' }} />
          <DataDisplay
            idKey={'guid'}
            tableContainerStyles={{ minWidth:700, maxWidth: 750 }}
            cellStyles = {{overflow: 'auto', maxWidth: 300}}
            style={{ marginTop: 12 }}
            noTitleBar
            variant="secondary"
            columns={columns}
            data={requests}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </MainColumn> 
    
  );
}
