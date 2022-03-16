import React from 'react';
import { get } from 'lodash-es';

import TreeEditor from './TreeEditor';
import ConfigureDefaultField from './ConfigureDefaultField';
import OptionEditor from '../saveField/OptionEditor';

// export function RelationshipEditor() {
//   return null;
// }

export function RelationshipEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  ...rest
}) {
  const speciesOptions = get(formSettings, 'relationships', []);
  console.log('deleteMe formSettings are: ');
  console.log(formSettings);

  return (
    <OptionEditor
      open
      onClose={onClose}
      onSubmit={onSubmit}
      schema={{
        labelId: 'EDIT_RELATIONSHIPS',
        descriptionId: 'EDIT_RELATIONSHIPS_DESCRIPTION',
      }}
      value={speciesOptions}
      onChange={newOptions => {
        setFormSettings({
          ...formSettings,
          relationships: newOptions,
        });
      }}
      {...rest}
    />
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
