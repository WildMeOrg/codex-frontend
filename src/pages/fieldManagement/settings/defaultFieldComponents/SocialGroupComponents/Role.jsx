import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { find, filter } from 'lodash-es';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextInput from '../../../../../components/inputs/TextInput';
import DeleteButton from '../../../../../components/DeleteButton';

function deleteRole(roles, roleGuid) {
  console.log('deleteMe deleteRole entered');
  const focalRole = find(roles, role => role?.guid === roleGuid);
  if (focalRole) {
    const remainingRoles = filter(
      roles,
      role => role?.guid !== roleGuid,
    );
    console.log('deleteMe got here and remainingRoles are: ');
    console.log(remainingRoles);
    return remainingRoles;
  }
  return roles;
}

function updateRoleLabel(roles, roleGuid, newRoleLabel) {
  console.log('deleteMe updateRoleLabel is called');
  const modifiedRoles = roles.map(role => {
    if (role?.guid === roleGuid)
      return { ...role, label: newRoleLabel };
    else return role;
  });
  //   console.log('deleteMe newRole is: ');
  //   console.log(newRole);
  console.log('deleteMe updateRoleLabel is returning: ');
  console.log(roles);
  return modifiedRoles;
}

function updateRoleMultipleInGroupStatus(
  roles,
  roleGuid,
  newStatus,
  setChecked,
) {
  console.log('deleteMe newStatus is: ');
  console.log(newStatus);
  const modifiedRoles = roles.map(role => {
    if (role?.guid === roleGuid)
      return { ...role, multipleInGroup: newStatus };
    else return role;
  });
  console.log('deleteMe roles is now: ');
  console.log(modifiedRoles);
  setChecked(newStatus);
  return modifiedRoles;
}

export default function Role({ roles, currentRole, onChange }) {
  const intl = useIntl();
  const roleGuid = currentRole?.guid;
  const roleLabel = currentRole?.label;
  const [checked, setChecked] = useState(
    currentRole?.multipleInGroup,
  );

  return (
    <div style={{ marginLeft: 32, marginTop: 10 }} key={roleGuid}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={e => {
                updateRoleMultipleInGroupStatus(
                  roles,
                  roleGuid,
                  e.target.checked,
                  setChecked,
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
