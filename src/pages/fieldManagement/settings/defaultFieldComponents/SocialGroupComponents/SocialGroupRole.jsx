import React from 'react';
import { useIntl } from 'react-intl';

import { get, filter } from 'lodash-es';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextInput from '../../../../../components/inputs/TextInput';
import DeleteButton from '../../../../../components/DeleteButton';

function deleteRole(roles, roleGuid) {
  return filter(roles, role => role?.guid !== roleGuid);
}

function updateRoleLabel(roles, roleGuid, newRoleLabel) {
  const modifiedRoles = roles.map(role => {
    if (role?.guid === roleGuid)
      return { ...role, label: newRoleLabel };
    return role;
  });
  return modifiedRoles;
}

function updateRoleMultipleInGroupStatus(roles, roleGuid, newStatus) {
  const modifiedRoles = roles.map(role => {
    if (role?.guid === roleGuid)
      return { ...role, multipleInGroup: newStatus };
    return role;
  });
  return modifiedRoles;
}

export default function SocialGroupRole({
  roles,
  currentRole,
  onChange,
}) {
  const intl = useIntl();
  const roleGuid = currentRole?.guid;
  const roleLabel = currentRole?.label;

  const checked = get(currentRole, 'multipleInGroup', false);

  return (
    <div style={{ marginLeft: 32, marginTop: 10 }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={e => {
                onChange(
                  updateRoleMultipleInGroupStatus(
                    roles,
                    roleGuid,
                    e.target.checked,
                  ),
                );
              }}
            />
          }
          label={intl.formatMessage({
            id: 'ALLOW_MULTIPLE_OF_THIS_ROLE',
          })}
        />
      </FormGroup>
      <TextInput
        width={240}
        schema={{ labelId: 'ROLE' }}
        onChange={newLabel => {
          onChange(updateRoleLabel(roles, roleGuid, newLabel));
        }}
        value={roleLabel}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DeleteButton
                onClick={() => {
                  onChange(deleteRole(roles, roleGuid));
                }}
              />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
