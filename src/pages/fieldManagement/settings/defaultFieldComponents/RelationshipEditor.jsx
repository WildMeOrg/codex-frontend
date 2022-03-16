import React from 'react';
import { get, filter } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import NewChildIcon from '@material-ui/icons/AddCircle';
import TextInput from '../../../../components/inputs/TextInput';
import DeleteButton from '../../../../components/DeleteButton';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';

function deleteCategory(allRelationshipsObj, category) {
  return allRelationshipsObj.filter(
    singleRelationshipObj =>
      !singleRelationshipObj?.category === category,
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
  // TODO if above arr.length > 1, throw error of some sort? Not sure what best practice here is or how to implement.
  const targetRelationshipCategoryObj = get(
    targetRelationshipCategoryObjArr,
    '0',
    {},
  );
  const modifiedArr = targetRelationshipCategoryObj.relationships.filter(
    entry => entry !== relationship,
  );
  const nonTargeCategoryObjects = filter(
    allRelationshipsObj,
    currentRelationshipCategory =>
      currentRelationshipCategory.category !== currentCategory,
  );
  const modifiedTargetCategoryObj = {
    category: currentCategory,
    relationships: modifiedArr,
  };
  return [...nonTargeCategoryObjects, modifiedTargetCategoryObj];
}

function renderSingleRelationship(
  allRelationshipsObj,
  currentCategory,
  relationship,
  onChange,
) {
  // console.log(
  //   'deleteMe got here entered renderSingleRelationshipObj',
  // );
  // console.log('deleteMe allRelationshipsObj is: ');
  // console.log(allRelationshipsObj);
  // console.log('deleteMe relationship is: ');
  // console.log(relationship);
  return (
    <div style={{ marginLeft: 32, marginTop: 10 }}>
      <TextInput
        width={240}
        schema={relationship}
        onChange={newName => {
          // addRelationshipToCategory(allRelationshipsObj, newName);
          onChange(
            addRelationshipToCategory(allRelationshipsObj, newName),
          );
        }}
        value={relationship}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <DeleteButton
                onClick={() => {
                  // deleteRelationship(
                  //   allRelationshipsObj,
                  //   currentCategory,
                  //   relationship,
                  // );
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

function createCategory(allRelationshipsObj) {
  const newCategoryObj = {
    category: 'Enter new category name here',
    relationships: [],
  };
  allRelationshipsObj.push(newCategoryObj);
  return allRelationshipsObj;
}

function addRelationshipToCategory(
  allRelationshipsObj,
  currentCategory,
  newRelationship,
) {
  console.log('deleteMe got here addRelationshipToCategory entered');
  const targetRelationshipCategoryObj = filter(
    allRelationshipsObj,
    currentRelationshipCategory =>
      currentRelationshipCategory.category === currentCategory,
  );
  const modifiedArr = targetRelationshipCategoryObj?.relationships?.push(
    newRelationship,
  );
  console.log('deleteMe modifiedArr is: ');
  console.log(modifiedArr);
  const nonTargeCategoryObjects = filter(
    allRelationshipsObj,
    currentRelationshipCategory =>
      currentRelationshipCategory.category !== currentCategory,
  );
  const modifiedTargetCategoryObj = {
    category: currentCategory,
    relationships: modifiedArr,
  };
  console.log('deleteMe return from addRelationshipToCategory is: ');
  console.log([
    ...nonTargeCategoryObjects,
    modifiedTargetCategoryObj,
  ]);
  return [...nonTargeCategoryObjects, modifiedTargetCategoryObj];
}

function renderSingleRelationshipObj(
  allRelationshipsObj,
  singleRelationshipObj,
  onChange,
) {
  console.log('deleteMe got here singleRelationshipObj are: ');
  console.log(singleRelationshipObj);
  const category = singleRelationshipObj?.category;
  const relationships = singleRelationshipObj?.relationships;
  console.log('deleteMe got here and relationships are: ');
  console.log(relationships);
  return (
    <div style={{ marginTop: 10 }}>
      <TextInput
        width={240}
        schema={category}
        onChange={newName => {
          // addRelationshipToCategory(allRelationshipsObj, newName);
          onChange(
            addRelationshipToCategory(allRelationshipsObj, newName),
          );
        }}
        value={category}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                // onClick={category => {
                //   createCategory(allRelationshipsObj, category);
                // }}
                onClick={() => {
                  onChange(
                    createCategory(allRelationshipsObj, category),
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
                // onClick={category => {
                //   deleteCategory(allRelationshipsObj, category);
                // }}
              />
            </InputAdornment>
          ),
        }}
      />
      {relationships.map(relationship => {
        return renderSingleRelationship(
          allRelationshipsObj,
          category,
          relationship,
          onChange,
        );
      })}
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
  console.log('deleteMe got here x0 and value is: ');
  console.log(value);
  console.log('deleteMe schema is: ');
  console.log(schema);
  console.log('deleteMe siteSettings are: ');
  console.log(siteSettings);
  // console.log('deleteMe onChange is: ');
  // console.log(onChange);
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
