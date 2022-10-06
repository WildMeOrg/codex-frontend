import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { v4 as uuid } from 'uuid';
import { get, uniq, map, some, filter } from 'lodash-es';

import ConfigureDefaultField from './ConfigureDefaultField';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import SocialGroupRole from './SocialGroupComponents/SocialGroupRole';

function createRole(roles) {
  const newRoleGuid = uuid();
  return [
    ...roles,
    { guid: newRoleGuid, label: '', multipleInGroup: true },
  ];
}

function validateSocialGroups(roles, intl) {
  const errors = [];
  const roleLabels = roles.map(role => role?.label);
  if (some(roleLabels, roleLabel => !roleLabel)) {
    errors.push(
      intl.formatMessage({
        id: 'ONE_OR_MORE_ROLES_MISSING_LABELS',
      }),
    );
  }
  const uniqueRoleLabels = uniq(roleLabels);
  if (uniqueRoleLabels.length !== roleLabels.length)
    errors.push(
      intl.formatMessage({
        id: 'TWO_OR_MORE_ROLES_SAME_LABEL',
      }),
    );
  return errors.length > 0 ? errors : null;
}

export default function SocialGroupsEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
}) {
  const intl = useIntl();
  const [formErrors, setFormErrors] = useState(null);
  function setRoles(roles) {
    setFormSettings({ ...formSettings, socialGroups: roles });
  }

  const roles = get(formSettings, 'socialGroups', []);
  const safeRoles = filter(roles, role => Boolean(role?.guid));

  return (
    <ConfigureDefaultField
      onClose={onClose}
      onSubmit={() => {
        const errors = validateSocialGroups(safeRoles, intl);
        setFormErrors(errors);
        if (!errors) onSubmit();
      }}
      open
      error={formErrors?.map(error => (
        <Text key={error} variant="body2">
          {error}
        </Text>
      ))}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{ maxWidth: 500 }}
          variant="h5"
          id="CONFIGURATION_SOCIAL_GROUP_ROLES_LABEL"
        />
        <Button
          onClick={() => {
            setRoles(createRole(safeRoles));
          }}
          style={{ width: 200 }}
          size="small"
          id="NEW_SOCIAL_GROUP_ROLE"
        />
      </div>
      <Text
        style={{ maxWidth: 500 }}
        variant="caption"
        component="p"
        id="CONFIGURATION_SOCIAL_GROUP_ROLES_DESCRIPTION"
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0',
        }}
      >
        {map(safeRoles, role => (
          <SocialGroupRole
            key={role?.guid}
            roles={safeRoles}
            currentRole={role}
            onChange={setRoles}
          />
        ))}
      </div>
    </ConfigureDefaultField>
  );
}
