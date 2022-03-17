import React from 'react';
import { useIntl } from 'react-intl';
import { get, filter } from 'lodash-es';

import { FormattedMessage } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import NewChildIcon from '@material-ui/icons/AddCircle';
import TextInput from '../../../../components/inputs/TextInput';
import DeleteButton from '../../../../components/DeleteButton';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';

const intl = useIntl();

function recomposeAllRelationshipObjectFromModifiedCategoryObject(
  currentAllRelationshipObject,
  modifiedTargetCategoryObj,
) {
  const nonTargeCategoryObjects = filter(
    currentAllRelationshipObject,
    currentRelationshipCategory =>
      currentRelationshipCategory.category !==
      modifiedTargetCategoryObj?.category,
  );
  return [...nonTargeCategoryObjects, modifiedTargetCategoryObj];
}

function deleteCategory(allRelationshipsObj, category) {
  return allRelationshipsObj.filter(
    singleRelationshipObj =>
      singleRelationshipObj?.category !== category,
  );
}

function deleteRelationship(
  allRelationshipsObj,
  currentCategory,
  relationship,
) {
  const targetRelationshipCategoryObjArr = filter(
    allRelationshipsObj,
    currentRelationshipCategory =>
      currentRelationshipCategory.category === currentCategory,
  );
  // if (targetRelationshipCategoryObjArr?.length > 1) return; // TODO how do we handle duplicate relationship categories/types?
  const targetRelationshipCategoryObj = get(
    targetRelationshipCategoryObjArr,
    '0',
    {},
  );
  const modifiedArr = targetRelationshipCategoryObj.relationships.filter(
    entry => entry !== relationship,
  );
  const modifiedTargetCategoryObj = {
    category: currentCategory,
    relationships: modifiedArr,
  };
  return recomposeAllRelationshipObjectFromModifiedCategoryObject(
    allRelationshipsObj,
    modifiedTargetCategoryObj,
  );
}

function updateRelationshipInCategory(
  allRelationshipsObj,
  category,
  oldRelationshipName,
  newRelationshipName,
) {
  const targetRelationshipCategoryObj = get(
    filter(
      allRelationshipsObj,
      currentRelationshipCategory =>
        currentRelationshipCategory?.category === category,
    ),
    '0',
    {},
  );
  const currentRelationships =
    targetRelationshipCategoryObj?.relationships;
  const oldRelationshipIndex = currentRelationships?.indexOf(
    oldRelationshipName,
  );
  if (oldRelationshipIndex > -1)
    currentRelationships[oldRelationshipIndex] = newRelationshipName;
  targetRelationshipCategoryObj.relationships = currentRelationships;
  return recomposeAllRelationshipObjectFromModifiedCategoryObject(
    allRelationshipsObj,
    targetRelationshipCategoryObj,
  );
}

function createCategory(allRelationshipsObj) {
  const newCategoryObj = {
    category: intl.formatMessage({ id: 'ENTER_NEW_CATEGORY_NAME' }),
    relationships: [],
  };
  allRelationshipsObj.push(newCategoryObj);
  return allRelationshipsObj;
}

function updateCategoryName(
  allRelationshipsObj,
  currentCategoryName,
  newCategoryName,
) {
  const targetRelationshipCategoryObj = get(
    filter(
      allRelationshipsObj,
      currentRelationshipCategory =>
        currentRelationshipCategory.category === currentCategoryName,
    ),
    '0',
    {},
  );
  targetRelationshipCategoryObj.category = newCategoryName;
  return recomposeAllRelationshipObjectFromModifiedCategoryObject(
    allRelationshipsObj,
    targetRelationshipCategoryObj,
  );
}

function addRelationshipToCategory(
  allRelationshipsObj,
  currentCategory,
  newRelationship,
) {
  const targetRelationshipCategoryObj = get(
    filter(
      allRelationshipsObj,
      currentRelationshipCategory =>
        currentRelationshipCategory.category === currentCategory,
    ),
    '0',
    {},
  );
  const targetRelationshipArr =
    targetRelationshipCategoryObj?.relationships;
  targetRelationshipArr.push(newRelationship);
  const modifiedArr = targetRelationshipArr;
  const modifiedTargetCategoryObj = {
    category: currentCategory,
    relationships: modifiedArr,
  };
  return recomposeAllRelationshipObjectFromModifiedCategoryObject(
    allRelationshipsObj,
    modifiedTargetCategoryObj,
  );
}

function renderSingleRelationship(
  allRelationshipsObj,
  currentCategory,
  relationship,
  onChange,
) {
  return (
    <div style={{ marginLeft: 32, marginTop: 10 }}>
      <TextInput
        width={240}
        schema={relationship}
        onChange={newRelationshipName => {
          onChange(
            updateRelationshipInCategory(
              allRelationshipsObj,
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
                      allRelationshipsObj,
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
  allRelationshipsObj,
  singleRelationshipObj,
  onChange,
) {
  const category = singleRelationshipObj?.category;
  const relationships = singleRelationshipObj?.relationships;
  return (
    <div style={{ marginTop: 10 }}>
      <TextInput
        width={240}
        schema={category}
        onChange={newName => {
          onChange(
            updateCategoryName(
              allRelationshipsObj,
              category,
              newName,
            ),
          );
        }}
        value={category}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onChange(
                    addRelationshipToCategory(
                      allRelationshipsObj,
                      category,
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
                    deleteCategory(allRelationshipsObj, category),
                  );
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {relationships.map(relationship =>
        renderSingleRelationship(
          allRelationshipsObj,
          category,
          relationship,
          onChange,
        ),
      )}
    </div>
  );
}

export default function RelationshipEditor({
  schema,
  value,
  onChange,
  siteSettings, // unpacking to prevent passing to div
  ...rest
}) {
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
            onChange(createCategory(value));
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
        {value.map(singleRelationshipObj =>
          renderSingleRelationshipObj(
            value,
            singleRelationshipObj,
            onChange,
          ),
        )}
      </div>
    </div>
  );
}
