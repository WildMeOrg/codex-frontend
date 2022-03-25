import React from 'react';
import { get } from 'lodash-es';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import NewChildIcon from '@material-ui/icons/AddCircle';

import TextInput from '../../../../../components/inputs/TextInput';
import DeleteButton from '../../../../../components/DeleteButton';
import Role from './Role';

function deleteCategory(relationships, category) {
  delete relationships[category];
  return relationships;
}

function updateCategoryName(
  relationships,
  currentCategoryName,
  newCategoryName,
) {
  const relationshipNames = get(relationships, currentCategoryName);
  delete relationships[currentCategoryName];
  relationships[newCategoryName] = relationshipNames;
  return relationships;
}

function addRole(relationships, category) {
  const currentRoles = get(relationships, category, []);
  return {
    ...relationships,
    [category]: [...currentRoles, ''],
  };
}

export default function Type({ relationships, category, onChange }) {
  const roles = get(relationships, category, []);
  return (
    <div style={{ marginTop: 10 }}>
      <TextInput
        width={240}
        schema={{ labelId: 'TYPE' }}
        onChange={newName => {
          onChange(
            updateCategoryName(relationships, category, newName),
          );
        }}
        value={category}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onChange(addRole(relationships, category));
                }}
              >
                <NewChildIcon />
              </IconButton>
              <DeleteButton
                onClick={() => {
                  onChange(deleteCategory(relationships, category));
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {roles.map(role => (
        <Role
          relationships={relationships}
          category={category}
          value={role}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
