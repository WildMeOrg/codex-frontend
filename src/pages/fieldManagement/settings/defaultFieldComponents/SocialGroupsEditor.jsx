import React, { useState } from 'react';

import { v4 as uuid } from 'uuid';
import { get, uniq, map } from 'lodash-es';

import ConfigureDefaultField from './ConfigureDefaultField';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import Alert from '../../../../components/Alert';
import SocialGroupRole from './SocialGroupComponents/SocialGroupRole';

function createRole(roles) {
  const newRoleGuid = uuid();
  return [
    ...roles,
    { guid: newRoleGuid, label: '', multipleInGroup: true },
  ];
}

function validateSocialGroups(roles) {
  const errors = [];
  const roleLabels = roles.map(role => role?.label);
  const emptyRoleLabels = roleLabels.filter(label => !label);
  if (emptyRoleLabels.length > 0)
    errors.push('One or more roles are missing labels');
  const uniqueRoleLabels = uniq(roleLabels);
  if (uniqueRoleLabels.length !== roleLabels.length)
    errors.push(
      'Two or more roles have the same label. Make sure each label is different',
    );
  return errors.length > 0 ? errors : null;
}

export default function SocialGroupsEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
}) {
  const [fromErrors, setFormErrors] = useState(null);
  function setRoles(roles) {
    setFormSettings({ ...formSettings, socialGroups: roles });
  }

  const roles = get(formSettings, 'socialGroups', []);

  return (
    <ConfigureDefaultField
      onClose={onClose}
      onSubmit={() => {
        const errors = validateSocialGroups(roles);
        setFormErrors(errors);
        if (!errors) onSubmit();
      }}
      open
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          variant="h5"
          id="CONFIGURATION_SOCIAL_GROUP_ROLES_LABEL"
        />
        <Button
          onClick={() => {
            setRoles(createRole(roles));
          }}
          style={{ width: 200 }}
          size="small"
          id="NEW_SOCIAL_GROUP_ROLE"
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
        }}
      >
        {map(
          roles,
          role => (
            <SocialGroupRole
              key={role?.guid}
              roles={roles}
              currentRole={role}
              onChange={setRoles}
            />
          ),
          [],
        )}
      </div>
      {fromErrors && (
        <Alert severity="error" titleId="AN_ERROR_OCCURRED">
          {fromErrors.map(error => (
            <Text key={error} variant="body2">
              {error}
            </Text>
          ))}
        </Alert>
      )}
    </ConfigureDefaultField>
  );
}
