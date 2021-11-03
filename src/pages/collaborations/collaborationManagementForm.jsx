import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Button from '../../components/Button';
import CustomAlert from '../../components/Alert';
import useEstablishCollaborationAsUserManager from '../../models/collaboration/useEstablishCollaborationAsUserManager';

export default function CollaborationManagementForm({ userData }) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const {
    establishCollaboration,
    error,
    success,
  } = useEstablishCollaborationAsUserManager();
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginRight: 20,
        }}
      >
        <Autocomplete
          id="select-collaborator-1"
          style={{ marginBottom: '20px' }}
          options={
            userData
              ? userData.filter(
                  user => get(user, 'guid', '') !== user2,
                )
              : []
          }
          getOptionLabel={option => get(option, 'full_name', 'guid')}
          getOptionSelected={(option, val) =>
            option.id ? option.id === val : false
          }
          renderInput={params => (
            <TextField
              {...params}
              style={{ width: 280 }}
              variant="standard"
              label={<FormattedMessage id="SELECT_COLLABORATOR_1" />}
            />
          )}
          onChange={(_, newValue) => {
            setUser1(get(newValue, 'guid', ''));
          }}
        />
        <Autocomplete
          id="select-collaborator-2"
          style={{ marginBottom: '20px' }}
          options={
            userData
              ? userData.filter(
                  user => get(user, 'guid', '') !== user1,
                )
              : []
          }
          getOptionLabel={option => get(option, 'full_name', 'guid')}
          getOptionSelected={(option, val) =>
            option.id ? option.id === val : false
          }
          renderInput={params => (
            <TextField
              {...params}
              style={{ width: 280 }}
              variant="standard"
              label={<FormattedMessage id="SELECT_COLLABORATOR_2" />}
            />
          )}
          onChange={(_, newValue) => {
            setUser2(get(newValue, 'guid', ''));
          }}
        />

        <Button
          display="primary"
          size="small"
          style={{ marginBottom: '20px' }}
          loading={buttonLoading}
          onClick={async () => {
            setButtonLoading(true);
            const successful = await establishCollaboration(
              //need the await here. Otherwise, setShouldDisplay(true) below fires asynchronously
              user1,
              user2,
            );
            setButtonLoading(false);
            setShouldDisplay(true);
          }}
        >
          <FormattedMessage id="CREATE_COLLABORATION" />
        </Button>
      </div>
      {success && shouldDisplay && (
        <CustomAlert
          style={{ margin: '0px 24px 20px 24px' }}
          titleId="COLLABORATION_CREATEDD"
          severity="success"
          onClose={() => {
            setShouldDisplay(false);
          }}
        />
      )}
      {error && shouldDisplay && (
        <CustomAlert
          style={{ margin: '20px 0', width: '100%' }}
          severity="error"
          titleId="SERVER_ERROR"
          onClose={() => {
            setShouldDisplay(false);
          }}
        >
          {error}
        </CustomAlert>
      )}
    </div>
  );
}
