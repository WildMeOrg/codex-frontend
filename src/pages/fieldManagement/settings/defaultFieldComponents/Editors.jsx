import React from 'react';
import { get, map } from 'lodash-es';

import TreeEditor from './TreeEditor';
import ConfigureDefaultField from './ConfigureDefaultField';
import RelationshipEditor from './RelationshipEditor';

export function RelationshipEditorWrapper({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  children,
  ...rest
}) {
  const relationshipOptions = formSettings
    ? get(formSettings, 'relationships')
    : [];

  const transformedRelationshipOptions = map(
    relationshipOptions,
    (relationshipArr, key) => {
      const currentObj = {};
      currentObj.category = key;
      currentObj.relationships = relationshipArr;
      return currentObj;
    },
  );

  return (
    <ConfigureDefaultField
      onClose={onClose}
      onSubmit={() => {
        onSubmit();
      }}
      open
    >
      <RelationshipEditor
        schema={{ labelId: 'RELATIONSHIPS' }}
        value={transformedRelationshipOptions}
        onChange={relationships => {
          const formSettingObj = {};
          const reformattedRelationships = relationships.reduce(
            (memo, obj) => {
              let currentObj = {};
              currentObj[(obj?.category)] = obj?.relationships;
              return { ...memo, ...currentObj };
            },
            {},
          );
          formSettingObj['relationships'] = reformattedRelationships;
          setFormSettings(formSettingObj);
        }}
        {...rest}
      />
      {children}
    </ConfigureDefaultField>
  );
}

export function RegionEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  children,
  ...rest
}) {
  const tree = get(formSettings, ['regions', 'locationID'], []);

  return (
    <ConfigureDefaultField onClose={onClose} onSubmit={onSubmit} open>
      <TreeEditor
        schema={{ labelId: 'REGIONS' }}
        value={tree}
        onChange={locationID => {
          const newRegions = {
            ...get(formSettings, 'regions', {}),
            locationID,
          };
          setFormSettings({
            ...formSettings,
            regions: newRegions,
          });
        }}
        {...rest}
      />
      {children}
    </ConfigureDefaultField>
  );
}
