import React from 'react';
import { get } from 'lodash-es';

import InputAdornment from '@material-ui/core/InputAdornment';

import TextInput from '../../../../../components/inputs/TextInput';
import DeleteButton from '../../../../../components/DeleteButton';

function deleteRole(relationships, category, role) {
  const currentRoles = get(relationships, category, []);
  const newRoles = currentRoles.filter(entry => entry !== role);
  relationships[category] = newRoles;
  return relationships;
}

function updateRole(
  relationships,
  category,
  oldRoleName,
  newRoleName,
) {
  const currentRoles = get(relationships, category);

  const oldRoleIndex = currentRoles?.indexOf(oldRoleName);
  if (oldRoleIndex > -1) currentRoles[oldRoleIndex] = newRoleName;
  relationships[category] = currentRoles;
  return relationships;
}

export default function Role({
  relationships,
  category,
  value,
  onChange,
}) {
  return (
    <div style={{ marginLeft: 32, marginTop: 10 }}>
      <TextInput
        width={240}
        schema={{ labelId: 'ROLE' }}
        onChange={newValue => {
          onChange(
            updateRole(relationships, category, value, newValue),
          );
        }}
        value={value}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DeleteButton
                onClick={() => {
                  onChange(
                    deleteRole(relationships, category, value),
                  );
                }}
              />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
