import React from 'react';
import { useIntl } from 'react-intl';

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { get } from 'lodash-es';

import Text from '../Text';
import { deriveIndividualName } from '../../utils/nameUtils';
import useIndividual from '../../models/individual/useIndividual';

export default function RelationshipRoleAutocomplete({
  id,
  value,
  options,
  onChangeRole,
  individualId,
}) {
  const intl = useIntl();
  const { data: individualData, loading } = useIndividual(
    individualId,
  );
  const individualFirstName = deriveIndividualName(
    individualData,
    'FirstName',
    intl.formatMessage({ id: 'UNNAMED_INDIVIDUAL' }),
  );
  return (
    <Autocomplete
      loading={loading}
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
      getOptionSelected={(option, val) => option.guid === val.guid}
      renderInput={params => (
        <TextField
          {...params}
          style={{ minWidth: 470, width: 'fit-content' }}
          variant="standard"
          label={intl.formatMessage(
            { id: 'SELECT_RELATIONSHIP_ROLE' },
            { ind: individualFirstName },
          )}
        />
      )}
    />
  );
}
