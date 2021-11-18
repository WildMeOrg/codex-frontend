import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import Text from '../../components/Text';
import usePostUser from '../../models/users/usePostUser';
import useGetUsers from '../../models/users/useGetUsers';
import UserEditTable from './UserEditTable';
import roleSchema from './constants/roleSchema';
import CollaborationManagementForm from '../collaborations/collaborationManagementForm';
import useGetAllCollaborations from '../../models/collaboration/useGetAllCollaborations';
import UserManagersCollaborationEditTable from './UserManagerCollaborationEditTable';

export default function UserManagement() {
  const intl = useIntl();
  useDocumentTitle('MANAGE_USERS');

  const {
    postUser,
    error: postUserError,
    loading: postUserLoading,
    setError: setPostUserError,
    success: postUserSuccess,
    setSuccess: setPostUserSuccess,
  } = usePostUser();

  const {
    data: userData,
    loading: userDataLoading,
    error: userDataError,
    refresh: refreshUserData,
  } = useGetUsers();

  const {
    allCollaborationData,
    getAllCollaborationsLoading,
    getAllCollaborationsError,
    getAllCollaborationsRefreshCount,
  } = useGetAllCollaborations();

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRoles, setNewUserRoles] = useState([]);
  return (
    <MainColumn>
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
        id="MANAGE_USERS"
      />
      <ButtonLink
        href="/admin"
        style={{ marginTop: 8, width: 'fit-content' }}
        display="back"
        id="BACK"
      />
      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ paddingBottom: 40 }}
      >
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="CREATE_NEW_USER"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Text
              id="NEW_USER_ADMIN_MESSAGE"
              style={{ marginBottom: 12 }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginRight: 20,
              }}
            >
              <LabeledInput
                schema={{
                  labelId: 'EMAIL_ADDRESS',
                  displayType: 'string',
                }}
                value={newUserEmail}
                onChange={setNewUserEmail}
              />
              <LabeledInput
                schema={{
                  labelId: 'PASSWORD',
                  displayType: 'string',
                }}
                type="password"
                value={newUserPassword}
                onChange={setNewUserPassword}
              />
              <FormControl style={{ width: 180 }}>
                <InputLabel id="select-roles-label">
                  <FormattedMessage id="ROLES" />
                </InputLabel>
                <Select
                  id="select-roles-selector"
                  multiple
                  value={newUserRoles}
                  onChange={e => {
                    setNewUserRoles(e.target.value);
                  }}
                  input={<Input id="select-roles-input" />}
                  renderValue={selected => (
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap' }}
                    >
                      {selected.map(value => {
                        const matchingRole = roleSchema.find(
                          r => r.id === value,
                        );
                        const chipLabelId = get(
                          matchingRole,
                          'titleId',
                          'ERROR',
                        );
                        const chipLabel = intl.formatMessage({
                          id: chipLabelId,
                        });
                        return (
                          <Chip
                            key={value}
                            label={chipLabel}
                            style={{ margin: '2px 6px' }}
                          />
                        );
                      })}
                    </div>
                  )}
                >
                  {roleSchema.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      <FormattedMessage id={role.titleId} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {Boolean(postUserError) && (
              <CustomAlert
                onClose={() => setPostUserError(null)}
                severity="error"
                titleId="SUBMISSION_ERROR"
                description={postUserError}
              />
            )}
            {Boolean(postUserSuccess) && (
              <CustomAlert
                onClose={() => setPostUserSuccess(null)}
                severity="success"
                titleId="USER_CREATED_SUCCESSFULLY"
                description={postUserSuccess}
              />
            )}
            <div style={{ marginTop: 8 }}>
              <Button
                display="primary"
                loading={postUserLoading}
                onClick={async () => {
                  const successful = await postUser(
                    newUserEmail,
                    newUserPassword,
                    newUserRoles,
                  );
                  if (successful) {
                    setNewUserEmail('');
                    setNewUserPassword('');
                    setNewUserRoles([]);
                    refreshUserData();
                  }
                }}
              >
                <FormattedMessage id="CREATE_ACCOUNT" />
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="EDIT_USERS"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <UserEditTable
              data={userData}
              loading={userDataLoading}
              usersError={userDataError}
              refreshUserData={refreshUserData}
            />
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="CREATE_COLLABORATIONS"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CollaborationManagementForm userData={userData} />
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="EDIT_COLLABORATIONS"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <UserManagersCollaborationEditTable
              data={allCollaborationData}
              loading={getAllCollaborationsLoading}
              error={getAllCollaborationsError}
              refresh={getAllCollaborationsRefreshCount}
            />
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
