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
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import Text from '../../components/Text';
import SettingsBreadcrumbs from '../../components/SettingsBreadcrumbs';
import usePostUser from '../../models/users/usePostUser';
import useGetUsers from '../../models/users/useGetUsers';
import UserEditTable from './UserEditTable';
import roleSchema from './constants/roleSchema';
import CollaborationManagementForm from './components/CollaborationManagementForm';
import useGetAllCollaborations from '../../models/collaboration/useGetAllCollaborations';
import UserManagerCollaborationEditTable from '../../components/UserManagerCollaborationEditTable';

const validRoles = roleSchema.filter(role => role.id !== 'is_staff');

export default function UserManagement() {
  const intl = useIntl();
  useDocumentTitle('MANAGE_USERS');

  const {
    mutate: postUser,
    error: postUserError,
    loading: postUserLoading,
    clearError: clearPostUserError,
    success: postUserSuccess,
    clearSuccess: clearPostUserSuccess,
  } = usePostUser();

  const { data: userData } = useGetUsers();

  const {
    data: allCollaborationData,
    loading: allCollaborationsLoading,
    error: allCollaborationsError,
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
      <SettingsBreadcrumbs currentPageTextId="MANAGE_USERS" />
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
                  {validRoles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      <FormattedMessage id={role.titleId} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {Boolean(postUserError) && (
              <CustomAlert
                onClose={clearPostUserError}
                severity="error"
                titleId="SUBMISSION_ERROR"
                description={postUserError}
              />
            )}
            {Boolean(postUserSuccess) && (
              <CustomAlert
                onClose={clearPostUserSuccess}
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
                  const successful = await postUser({
                    email: newUserEmail,
                    password: newUserPassword,
                    roles: newUserRoles,
                  });
                  if (successful) {
                    setNewUserEmail('');
                    setNewUserPassword('');
                    setNewUserRoles([]);
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
            <UserEditTable />
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
            <CollaborationManagementForm
              userData={userData}
              existingCollaborations={allCollaborationData}
            />
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="USER_MANAGEMENT_COLLABORATIONS"
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
            <UserManagerCollaborationEditTable
              inputData={allCollaborationData}
              collaborationLoading={allCollaborationsLoading}
              collaborationError={allCollaborationsError}
            />
          </Paper>
        </Grid>
      </Grid>
    </MainColumn>
  );
}
