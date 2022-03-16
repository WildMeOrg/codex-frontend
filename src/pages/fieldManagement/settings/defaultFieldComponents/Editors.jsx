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
  console.log('deleteMe got here w0 and formSettings is: ');
  console.log(formSettings);
  // const relationshipOptions = get(formSettings, 'relationships');
  const relationshipOptions =
    get(formSettings, 'relationships') ||
    formSettings.reduce((memo, obj) => {
      console.log('deleteMe got here and memo is: ');
      console.log(memo);
      console.log('deleteMe got here and obj is: ');
      console.log(obj);
      return { ...memo, ...obj };
    });
  console.log('deleteMe relationshipOptions is: ');
  console.log(relationshipOptions);
  const transformedRelationshipOptions = map(
    relationshipOptions,
    (relationshipArr, key) => {
      let currentObj = {};
      currentObj['category'] = key;
      currentObj['relationships'] = relationshipArr;
      return currentObj;
    },
  );
  console.log('deleteMe transformedRelationshipOptions are: ');
  console.log(transformedRelationshipOptions);
  const sortedRelationshipOptions = transformedRelationshipOptions.sort(
    (a, b) => {
      if (b.category === 'Enter new category name here') return -1;
      if (a.category === 'Enter new category name here') return 1;
      return a.category > b.category ? 1 : -1;
    },
  );
  console.log('deleteMe sortedRelationshipOptions is: ');
  console.log(sortedRelationshipOptions);

  return (
    <ConfigureDefaultField onClose={onClose} onSubmit={onSubmit} open>
      <RelationshipEditor
        schema={{ labelId: 'RELATIONSHIPS' }}
        value={sortedRelationshipOptions}
        onChange={relationships => {
          console.log(
            'deleteMe got into onChange in editors.jsx and relationships is: ',
          );
          console.log(relationships);

          const newFormSettings = relationships.map(
            relationshipOjb => {
              let newRelationshipOjb = {};
              newRelationshipOjb[(relationshipOjb?.category)] =
                relationshipOjb?.relationships;
              return newRelationshipOjb;
            },
          );
          console.log('deleteMe newFormSettings is: ');
          console.log(newFormSettings);
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
          setFormSettings(
            // ...formSettings,
            // ...relationships,
            newFormSettings,
          );
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
