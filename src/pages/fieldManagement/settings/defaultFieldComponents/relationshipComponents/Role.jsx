import React from 'react';
import { get } from 'lodash-es';

import InputAdornment from '@material-ui/core/InputAdornment';

import TextInput from '../../../../../components/inputs/TextInput';
import DeleteButton from '../../../../../components/DeleteButton';

function deleteRole(relationships, typeGuid, roleGuid) {
  const currentType = get(relationships, typeGuid);
  const currentRoles = currentType?.roles;
  if (currentType && currentRoles) {
    const newRoles = currentRoles.filter(r => r?.guid !== roleGuid);
    return {
      ...relationships,
      [typeGuid]: {
        ...currentType,
        roles: newRoles,
      },
    };
  }
  return relationships;
}

function updateRoleLabel(
  relationships,
  typeGuid,
  roleGuid,
  newRoleLabel,
) {
  const currentType = get(relationships, typeGuid);
  const currentRoles = currentType?.roles;
  if (currentType && currentRoles) {
    const newRoles = currentRoles.map(r => {
      if (r?.guid === roleGuid) return { ...r, label: newRoleLabel };
      return r;
    });
    return {
      ...relationships,
      [typeGuid]: {
        ...currentType,
        roles: newRoles,
      },
    };
  }
  return relationships;
}

export default function Role({
  relationships,
  typeGuid,
  value,
  onChange,
}) {
  const roleGuid = value?.guid;
  const roleLabel = value?.label || '';

  return (
    <div style={{ marginLeft: 32, marginTop: 10 }}>
      <TextInput
        width={240}
        schema={{ labelId: 'ROLE' }}
        onChange={newLabel => {
          onChange(
            updateRoleLabel(
              relationships,
              typeGuid,
              roleGuid,
              newLabel,
            ),
          );
        }}
        value={roleLabel}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DeleteButton
                onClick={() => {
                  onChange(
                    deleteRole(relationships, typeGuid, roleGuid),
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
