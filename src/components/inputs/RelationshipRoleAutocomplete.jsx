import React from 'react';
import { useIntl } from 'react-intl';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { get } from 'lodash-es';

import Text from '../Text';

export default function RelationshipRoleAutocomplete({
  id,
  value,
  options,
  onChangeRole,
  individualFirstName,
}) {
  const intl = useIntl();
  return (
    <Autocomplete
      id={id}
      clearOnEscape
      style={{ marginTop: 12, width: 'fit-content' }}
      value={value}
      options={options}
      renderOption={option => (
        <Text value={option.guid}>{option.label}</Text>
      )}
      onChange={(_, newValue) => onChangeRole(newValue)}
      getOptionLabel={option => get(option, 'label', '')}
      getOptionSelected={(option, val) =>
        option.guid ? option.guid === val : false
      }
      renderInput={params => (
        <TextField
          {...params}
          style={{ minWidth: 470, width: 'fit-content' }}
          variant="standard"
          label={intl.formatMessage(
            { id: 'SELECT_RELATIONSHIP_ROLE' },
            {
              ind:
                individualFirstName ||
                intl.formatMessage({
                  id: 'UNNAMED_INDIVIDUAL',
                }),
            },
          )}
        />
      )}
    />
  );
}
