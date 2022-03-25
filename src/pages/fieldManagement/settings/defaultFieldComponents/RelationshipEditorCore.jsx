import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import NewChildIcon from '@material-ui/icons/AddCircle';
import TextInput from '../../../../components/inputs/TextInput';
import DeleteButton from '../../../../components/DeleteButton';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';

function deleteCategory(allRelationships, category) {
  delete allRelationships[category];
  return allRelationships;
}

function deleteRelationship(
  allRelationships,
  currentCategory,
  relationship,
) {
  const targetRelationshipCategory = get(
    allRelationships,
    currentCategory,
    [],
  );
  const relationshipsWithoutTarget = targetRelationshipCategory.filter(
    entry => entry !== relationship,
  );
  allRelationships[currentCategory] = relationshipsWithoutTarget;
  return allRelationships;
}

function updateRelationshipInCategory(
  allRelationships,
  category,
  oldRelationshipName,
  newRelationshipName,
) {
  const currentRelationships = get(allRelationships, category);

  const oldRelationshipIndex = currentRelationships?.indexOf(
    oldRelationshipName,
  );
  if (oldRelationshipIndex > -1)
    currentRelationships[oldRelationshipIndex] = newRelationshipName;
  allRelationships[category] = currentRelationships;
  return allRelationships;
}

function createCategory(allRelationships) {
  return { ...allRelationships, ['']: [] };
}

function updateCategoryName(
  allRelationships,
  currentCategoryName,
  newCategoryName,
) {
  const relationshipNames = get(
    allRelationships,
    currentCategoryName,
  );
  delete allRelationships[currentCategoryName];
  allRelationships[newCategoryName] = relationshipNames;
  return allRelationships;
}

function addRelationshipToCategory(
  allRelationships,
  currentCategory,
  newRelationship,
) {
  const currentRelationships = get(
    allRelationships,
    currentCategory,
    [],
  );
  let newRelationships = currentRelationships;
  if (!currentRelationships.includes(newRelationship))
    newRelationships = [...currentRelationships, newRelationship];
  allRelationships[currentCategory] = newRelationships;
  return allRelationships;
}

function renderSingleRelationship(
  allRelationships,
  currentCategory,
  relationship,
  onChange,
) {
  return (
    <div style={{ marginLeft: 32, marginTop: 10 }} key={relationship}>
      <TextInput
        width={240}
        schema={relationship}
        onChange={newRelationshipName => {
          onChange(
            updateRelationshipInCategory(
              allRelationships,
              currentCategory,
              relationship,
              newRelationshipName,
            ),
          );
        }}
        value={relationship}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DeleteButton
                onClick={() => {
                  onChange(
                    deleteRelationship(
                      allRelationships,
                      currentCategory,
                      relationship,
                    ),
                  );
                }}
              />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

function renderSingleRelationshipObj(
  allRelationships,
  targetKey,
  onChange,
) {
  const relationships = get(allRelationships, targetKey, []);
  return (
    <div style={{ marginTop: 10 }} key={targetKey}>
      <TextInput
        width={240}
        schema={targetKey}
        onChange={newName => {
          onChange(
            updateCategoryName(allRelationships, targetKey, newName),
          );
        }}
        value={targetKey}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onChange(
                    addRelationshipToCategory(
                      allRelationships,
                      targetKey,
                      '',
                    ),
                  );
                }}
              >
                <NewChildIcon />
              </IconButton>
              <DeleteButton
                onClick={() => {
                  onChange(
                    deleteCategory(allRelationships, targetKey),
                  );
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {relationships.map(relationship =>
        renderSingleRelationship(
          allRelationships,
          targetKey,
          relationship,
          onChange,
        ),
      )}
    </div>
  );
}

export default function RelationshipEditorCore({
  schema,
  value,
  onChange,
  siteSettings, // unpacking to prevent passing to div
  ...rest
}) {
  const justRelationshipsFormPart = get(
    value,
    'relationships',
    value,
  );
  return (
    <div {...rest}>
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
            onChange(createCategory(justRelationshipsFormPart));
          }}
          style={{ width: 200 }}
          size="small"
        >
          <FormattedMessage id="NEW_RELATIONSHIP" />
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
        }}
      >
        {Object.keys(justRelationshipsFormPart).map(key =>
          renderSingleRelationshipObj(
            justRelationshipsFormPart,
            key,
            onChange,
          ),
        )}
      </div>
    </div>
  );
}
