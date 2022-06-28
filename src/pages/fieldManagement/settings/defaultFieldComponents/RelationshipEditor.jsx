import React, { useState } from 'react';
import { get, uniq } from 'lodash-es';
import { v4 as uuid } from 'uuid';

import ConfigureDefaultField from './ConfigureDefaultField';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import Alert from '../../../../components/Alert';
import Type from './relationshipComponents/Type';

function createType(relationships) {
  const newRelationshipGuid = uuid();
  return {
    ...relationships,
    [newRelationshipGuid]: { guid: newRelationshipGuid, label: '' },
  };
}

function validateRelationships(relationships) {
  const errors = [];
  const types = Object.values(relationships);
  const typeLabels = types.map(t => t?.label);
  const emptyTypeLabels = typeLabels.filter(label => !label);
  if (emptyTypeLabels.length > 0)
    errors.push('One or more relationship types are missing labels.');
  const uniqueTypeLabels = uniq(typeLabels);
  if (uniqueTypeLabels.length !== typeLabels.length)
    errors.push(
      'Two or more relationship types have the same label. Make sure each label is different.',
    );
  types.forEach(type => {
    const typeLabel = type?.label;
    const roleLabels = get(type, 'roles', []).map(r => r?.label);
    if (roleLabels.length === 0)
      errors.push(`Type "${typeLabel}" must have at least one role.`);
    const emptyRoleLabels = roleLabels.filter(label => !label);
    if (emptyRoleLabels.length > 0)
      errors.push(
        `One or more roles for the type "${typeLabel}" are missing labels.`,
      );
    const uniqueRoleLabels = uniq(roleLabels);
    if (uniqueRoleLabels.length !== roleLabels.length)
      errors.push(
        `Two or more roles for the type "${typeLabel}" have the same label. Make sure each label is different.`,
      );
  });
  return errors.length > 0 ? errors : null;
}

export default function RelationshipEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
}) {
  const [formErrors, setFormErrors] = useState(null);

  function setRelationships(relationships) {
    setFormSettings({ ...formSettings, relationships });
  }

  const relationships = get(formSettings, ['relationships'], {});

  return (
    <ConfigureDefaultField
      onClose={onClose}
      onSubmit={() => {
        const errors = validateRelationships(relationships);
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
        <Text variant="h5" id="RELATIONSHIP_EDITOR" />
        <Button
          onClick={() => {
            setRelationships(createType(relationships));
          }}
          style={{ width: 200 }}
          size="small"
          id="NEW_RELATIONSHIP_TYPE"
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
        }}
      >
        {Object.values(relationships).map(relationshipType => (
          <Type
            key={relationshipType?.guid}
            relationships={relationships}
            type={relationshipType}
            onChange={setRelationships}
          />
        ))}
      </div>
      {formErrors && (
        <Alert severity="error" titleId="AN_ERROR_OCCURRED">
          {formErrors.map(error => (
            <Text key={error} variant="body2">
              {error}
            </Text>
          ))}
        </Alert>
      )}
    </ConfigureDefaultField>
  );
}
