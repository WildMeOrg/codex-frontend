import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import Button from '../../../components/Button';
import CustomAlert from '../../../components/Alert';
import useEstablishCollaborationAsUserManager from '../../../models/collaboration/useEstablishCollaborationAsUserManager';
import {
  mutuallyRevokedCollabExists,
  collaborationAlreadyExists,
} from '../../../utils/formatters';
import { formatUserMessage } from '../utils';

export default function CollaborationManagementForm({
  userData,
  existingCollaborations,
}) {
  const intl = useIntl();
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const [formError, setFormError] = useState(null);
  const {
    mutate: establishCollaboration,
    loading,
    error: establishCollaborationError,
    clearError: clearEstablishCollaborationError,
    success,
    clearSuccess,
  } = useEstablishCollaborationAsUserManager();

  const error = establishCollaborationError || formError;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          marginRight: 20,
        }}
      >
        <Autocomplete
          id="select-collaborator-1"
          style={{ marginBottom: '20px', marginRight: '20px' }}
          options={
            userData
              ? userData.filter(
                  user => get(user, 'guid', '') !== user2,
                )
              : []
          }
          getOptionLabel={option =>
            formatUserMessage(
              { fullName: option?.full_name, email: option?.email },
              intl,
            )
          }
          getOptionSelected={(option, val) =>
            option.guid ? option.guid === val.guid : false
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
          getOptionLabel={option =>
            formatUserMessage(
              { fullName: option?.full_name, email: option?.email },
              intl,
            )
          }
          getOptionSelected={(option, val) =>
            option.guid ? option.guid === val.guid : false
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
          loading={loading}
          id="CREATE_COLLABORATION"
          onClick={async () => {
            clearSuccess();
            clearEstablishCollaborationError();
            setFormError(null);

            if (
              mutuallyRevokedCollabExists(
                existingCollaborations,
                user1,
                user2,
              )
            ) {
              setFormError(
                intl.formatMessage({
                  id: 'REVOKED_COLLAB_EXISTS',
                }),
              );
            } else if (
              !collaborationAlreadyExists(
                existingCollaborations,
                user1,
                user2,
              )
            ) {
              await establishCollaboration({
                user1Guid: user1,
                user2Guid: user2,
              });
            } else {
              setFormError(
                intl.formatMessage({
                  id: 'COLLABORATION_ALREADY_EXISTS',
                }),
              );
            }
          }}
        />
      </div>
      {success && (
        <CustomAlert
          titleId="COLLABORATION_CREATED"
          severity="success"
          onClose={clearSuccess}
        />
      )}
      {error && (
        <CustomAlert
          severity="error"
          titleId="SERVER_ERROR"
          description={error}
          onClose={() => {
            clearEstablishCollaborationError();
            setFormError(null);
          }}
        />
      )}
    </div>
  );
}
