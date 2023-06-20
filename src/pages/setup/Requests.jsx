import React, { useEffect, useState } from 'react';
import MainColumn from '../../components/MainColumn';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Text from '../../components/Text';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import useGetRequests from '../../models/users/useGetRequests';
import { useIntl } from 'react-intl';

export default function Requests() {
    const intl = useIntl();
    const {
        data,
        isLoading,
        error,
      } = useGetRequests();
    const requests = data || [];

    const columns = [
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
        },
      ];

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
            style={{ marginTop: 12 }}
            noTitleBar
            variant="secondary"
            columns={columns}
            data={requests}
          />
        </CardContent>
      </Card>
    </MainColumn>
  );
}
