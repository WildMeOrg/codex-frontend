import React from 'react';

import { find, filter } from 'lodash-es';
import InputAdornment from '@material-ui/core/InputAdornment';

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

// function updateRoleMultipleInGroupStatus(roles, roleGuid, newStatus) {
//   roles.map(role => {
//     if (role?.guid === roleGuid)
//       return { ...role, multipleInGroup: newStatus };
//     else return role;
//   });
//   return roles;
// } // TODO deleteMe

export default function Role({ roles, currentRole, onChange }) {
  const roleGuid = currentRole?.guid;
  const roleLabel = currentRole?.label;

  return (
    <div style={{ marginLeft: 32, marginTop: 10 }}>
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
      ></TextInput>
    </div>
  );
}
