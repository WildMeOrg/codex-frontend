import React from 'react';
import { get } from 'lodash-es';

import ConfigureDefaultField from './ConfigureDefaultField';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import Type from './relationshipComponents/Type';

function createCategory(relationships) {
  return { ...relationships, ['']: [] };
}

export default function RelationshipEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
}) {
  function setRelationships(relationships) {
    setFormSettings({ relationships });
  }

  const relationships = get(formSettings, ['relationships'], {});

  return (
    <ConfigureDefaultField onClose={onClose} onSubmit={onSubmit} open>
      <div>
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
              setRelationships(createCategory(relationships));
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
          {Object.keys(relationships).map(category => (
            <Type
              relationships={relationships}
              category={category}
              onChange={setRelationships}
            />
          ))}
        </div>
      </div>
    </ConfigureDefaultField>
  );
}
