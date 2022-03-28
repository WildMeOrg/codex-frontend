import React from 'react';
import { get, omit } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import NewChildIcon from '@material-ui/icons/AddCircle';

import TextInput from '../../../../../components/inputs/TextInput';
import DeleteButton from '../../../../../components/DeleteButton';
import Role from './Role';

function deleteType(relationships, typeGuid) {
  return omit(relationships, [typeGuid]);
}

function updateType(relationships, typeGuid, newTypeLabel) {
  const type = get(relationships, typeGuid, {});
  return {
    ...relationships,
    [typeGuid]: {
      ...type,
      label: newTypeLabel,
    },
  };
}

function addRole(relationships, typeGuid) {
  const type = get(relationships, typeGuid, {});
  const currentRoles = type?.roles || [];
  return {
    ...relationships,
    [typeGuid]: {
      ...type,
      roles: [...currentRoles, { guid: uuid(), label: '' }],
    },
  };
}

export default function Type({ relationships, type, onChange }) {
  const typeLabel = type?.label || '';
  const typeGuid = type?.guid;
  const roles = get(type, 'roles', []);
  const safeRoles = roles.filter(r => r?.guid);

  return (
    <div style={{ marginTop: 10 }}>
      <TextInput
        width={240}
        schema={{ labelId: 'TYPE' }}
        onChange={newLabel => {
          onChange(updateType(relationships, typeGuid, newLabel));
        }}
        value={typeLabel}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onChange(addRole(relationships, typeGuid));
                }}
              >
                <NewChildIcon />
              </IconButton>
              <DeleteButton
                onClick={() => {
                  onChange(deleteType(relationships, typeGuid));
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {safeRoles.map(role => (
        <Role
          key={role.guid}
          relationships={relationships}
          typeGuid={typeGuid}
          value={role}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
