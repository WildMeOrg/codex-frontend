import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import NewChildIcon from '@material-ui/icons/AddCircle';
import TextInput from '../../../../components/inputs/TextInput';
import DeleteButton from '../../../../components/DeleteButton';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';

function getNewLeaf() {
  return {
    id: uuid(),
    name: '',
  };
}

function deleteFromTree(tree, deleteId) {
  const prunedTree = tree.map(leaf => {
    const newLocationID = leaf.locationID
      ? deleteFromTree(leaf.locationID, deleteId)
      : undefined;
    return { ...leaf, locationID: newLocationID };
  });

  return prunedTree.filter(leaf => leaf.id !== deleteId);
}

function addLeaf(tree, parentId) {
  // Set parentId falsey and the leaf will be added to the root of the tree.
  if (!parentId) return [getNewLeaf(), ...tree];
  return tree.map(leaf => {
    let newLocationID = leaf.locationID
      ? addLeaf(leaf.locationID, parentId)
      : undefined;
    if (leaf.id === parentId) {
      newLocationID = newLocationID
        ? [getNewLeaf(), ...newLocationID]
        : [getNewLeaf()];
    }
    return { ...leaf, locationID: newLocationID };
  });
}

function updateTree(tree, leafId, newLeafName) {
  return tree.map(leaf => {
    const newLocationID = leaf.locationID
      ? updateTree(leaf.locationID, leafId, newLeafName)
      : undefined;
    const newLeaf = { ...leaf, locationID: newLocationID };
    if (newLeaf.id === leafId) newLeaf.name = newLeafName;
    return newLeaf;
  });
}

const Leaf = function({ level, data, root, onChange, children }) {
  return (
    <div style={{ marginLeft: level * 32, marginTop: 10 }}>
      <TextInput
        width={240}
        schema={{ name: get(data, 'name') }}
        onChange={newName => {
          onChange(updateTree(root, data.id, newName));
        }}
        value={get(data, 'name')}
        autoFocus
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onChange(addLeaf(root, data.id));
                }}
              >
                <NewChildIcon />
              </IconButton>
              <DeleteButton
                onClick={() => {
                  onChange(deleteFromTree(root, data.id));
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {children}
    </div>
  );
};

function renderLevel(leaves, level, value, onChange) {
  if (!leaves) return null;
  return (
    <>
      {leaves.map(leaf => (
        <Leaf
          key={`${leaf.id}-${level}`}
          data={leaf}
          level={level}
          root={value}
          onChange={onChange}
        >
          {renderLevel(
            get(leaf, 'locationID'),
            level + 1,
            value,
            onChange,
          )}
        </Leaf>
      ))}
    </>
  );
}

export default function TreeEditor({
  schema,
  value,
  onChange,
  siteSettings, // unpacking to prevent passing to div
  ...rest
}) {
  console.log('deleteMe got here x0');
  return (
    <div {...rest}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text variant="h5" id="REGION_EDITOR" />
        <Button
          onClick={() => {
            onChange(addLeaf(value));
          }}
          style={{ width: 200 }}
          size="small"
        >
          <FormattedMessage id="NEW_REGION" />
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
        }}
      >
        {renderLevel(value, 0, value, onChange)}
      </div>
    </div>
  );
}
