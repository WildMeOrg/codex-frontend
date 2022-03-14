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
  const relationshipOptions = get(formSettings, 'relationships', []);
  const transformedRelationshipOptions = map(
    relationshipOptions,
    (relationshipArr, key) => {
      let currentObj = {};
      currentObj['category'] = key;
      currentObj['relationships'] = relationshipArr;
      return currentObj;
    },
  );

  return (
    <ConfigureDefaultField onClose={onClose} onSubmit={onSubmit} open>
      <RelationshipEditor
        schema={{ labelId: 'RELATIONSHIPS' }}
        value={transformedRelationshipOptions}
        onChange={relationships => {
          console.log(
            'deleteMe got into onChange in editors.jsx and relationships is: ',
          );
          console.log(relationships);
          // const newRelationship = {
          //   ...get(formSettings, 'relationships', {}),
          //   relationship,
          // };
          // console.log(
          //   'deleteMe got here z0 and newRelationship is: ',
          // );
          // console.log(newRelationship);
          // setFormSettings({
          //   ...formSettings,
          //   relationships: newRelationship,
          // });
          setFormSettings({
            ...formSettings,
            ...relationships,
          });
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
