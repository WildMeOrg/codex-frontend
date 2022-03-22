import React from 'react';
import { get } from 'lodash-es';

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
  const transformedRelationshipOptions = get(
    formSettings,
    'relationships',
    formSettings,
  );

  return (
    <ConfigureDefaultField onClose={onClose} onSubmit={onSubmit} open>
      <RelationshipEditor
        schema={{ labelId: 'RELATIONSHIPS' }}
        value={transformedRelationshipOptions}
        onChange={relationships => {
          const formSettingObj = {};
          formSettingObj['relationships'] = relationships;
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
