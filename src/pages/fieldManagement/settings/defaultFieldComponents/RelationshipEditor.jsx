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
        onChange={newRelationshipName => {
          // addRelationshipToCategory(allRelationshipsObj, newName);
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
    category: 'Enter new category name here', // TODO intl format
    relationships: [],
  };
  allRelationshipsObj.push(newCategoryObj);
  return allRelationshipsObj;
}

function updateRelationshipInCategory(
  allRelationshipsObj,
  category,
  oldRelationshipName,
  newRelationshipName,
) {
  console.log(
    'deleteMe got here updateRelationshipInCategory entered',
  );
  console.log('deleteMe allRelationshipsObj is: ');
  console.log(allRelationshipsObj);
  console.log('deleteMe category is: ' + category);
  console.log(
    'deleteMe oldRelationshipName is: ' + oldRelationshipName,
  );
  console.log(
    'deleteMe newRelationshipName is: ' + newRelationshipName,
  );
  const targetRelationshipCategoryObj = get(
    filter(
      allRelationshipsObj,
      currentRelationshipCategory =>
        currentRelationshipCategory.category === category,
    ),
    '0',
    {},
  );
  console.log(
    'deleteMe targetRelationshipCategoryObj in updateRelationshipInCategory is: ',
  );
  console.log(targetRelationshipCategoryObj);
  const currentRelationships =
    targetRelationshipCategoryObj?.relationships;
  //TODO replace a given value with another
  const oldRelationshipIndex = currentRelationships.indexOf(
    oldRelationshipName,
  );
  if (oldRelationshipIndex > -1)
    currentRelationships[oldRelationshipIndex] = newRelationshipName;
  targetRelationshipCategoryObj.relationships = currentRelationships;
  const nonTargeCategoryObjects = filter(
    allRelationshipsObj,
    currentRelationshipCategory =>
      currentRelationshipCategory.category !== category,
  );
  console.log('deleteMe return from updateCategoryName is: ');
  console.log([
    ...nonTargeCategoryObjects,
    targetRelationshipCategoryObj,
  ]);
  return [...nonTargeCategoryObjects, targetRelationshipCategoryObj];
}

function updateCategoryName(
  allRelationshipsObj,
  currentCategoryName,
  newCategoryName,
) {
  console.log('deleteMe got here updateCategoryName entered');
  console.log('deleteMe allRelationshipsObj is: ');
  console.log(allRelationshipsObj);
  console.log(
    'deleteMe currentCategoryName is: ' + currentCategoryName,
  );
  console.log('deleteMe newCategoryName is: ' + newCategoryName);
  const targetRelationshipCategoryObj = get(
    filter(
      allRelationshipsObj,
      currentRelationshipCategory =>
        currentRelationshipCategory.category === currentCategoryName,
    ),
    '0',
    {},
  );
  console.log(
    'deleteMe targetRelationshipCategoryObj in addRelationshipToCategory is: ',
  );
  console.log(targetRelationshipCategoryObj);
  targetRelationshipCategoryObj.category = newCategoryName;
  const nonTargeCategoryObjects = filter(
    allRelationshipsObj,
    currentRelationshipCategory =>
      currentRelationshipCategory.category !== currentCategoryName,
  );
  console.log('deleteMe return from updateCategoryName is: ');
  console.log([
    ...nonTargeCategoryObjects,
    targetRelationshipCategoryObj,
  ]);
  return [...nonTargeCategoryObjects, targetRelationshipCategoryObj];
}

function addRelationshipToCategory(
  allRelationshipsObj,
  currentCategory,
  newRelationship,
) {
  console.log('deleteMe got here addRelationshipToCategory entered');
  console.log('deleteMe allRelationshipsObj is: ');
  console.log(allRelationshipsObj);
  console.log('deleteMe currentCategory is: ' + currentCategory);
  console.log('deleteMe newRelationship is: ' + newRelationship);
  const targetRelationshipCategoryObj = get(
    filter(
      allRelationshipsObj,
      currentRelationshipCategory =>
        currentRelationshipCategory.category === currentCategory,
    ),
    '0',
    {},
  );
  console.log(
    'deleteMe targetRelationshipCategoryObj in addRelationshipToCategory is: ',
  );
  console.log(targetRelationshipCategoryObj);
  const targetRelationshipArr =
    targetRelationshipCategoryObj?.relationships;
  targetRelationshipArr.push(newRelationship);
  const modifiedArr = targetRelationshipArr;
  // const modifiedArr = targetRelationshipCategoryObj?.relationships.push(
  //   newRelationship,
  // );
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
  // console.log('deleteMe got here singleRelationshipObj are: ');
  // console.log(singleRelationshipObj);
  const category = singleRelationshipObj?.category;
  console.log(
    'deleteMe category in renderSingleRelationshipObj before rendering is: ' +
      category,
  );
  const relationships = singleRelationshipObj?.relationships;
  // let newName;
  // console.log('deleteMe got here and relationships are: ');
  // console.log(relationships);
  return (
    <div style={{ marginTop: 10 }}>
      <TextInput
        width={240}
        schema={category}
        onChange={newName => {
          console.log('deleteMe newName is: ' + newName);
          // addRelationshipToCategory(allRelationshipsObj, newName);
          onChange(
            updateCategoryName(
              allRelationshipsObj,
              category,
              newName,
            ),
            // addRelationshipToCategory(
            //   allRelationshipsObj,
            //   category,
            //   newName,
            // ),
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
  // console.log('deleteMe got here x0 and value is: ');
  // console.log(value);
  // console.log('deleteMe schema is: ');
  // console.log(schema);
  // console.log('deleteMe siteSettings are: ');
  // console.log(siteSettings);
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
