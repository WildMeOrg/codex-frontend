import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import NewChildIcon from '@material-ui/icons/AddCircle';
import TextInput from '../../../../components/inputs/TextInput';
import DeleteButton from '../../../../components/DeleteButton';
import Button from '../../../../components/Button';

function getNewLeaf() {
  return {
    id: uuid(),
    name: '',
  };
}

function updateTree(tree, leafId, newLeafName) {
  const newTree = [...tree];
  function updateLevel(leaves) {
    leaves.forEach((leaf, i) => {
      if (leaf.id === leafId) {
        leaves[i] = {
          ...leaves[i],
          name: newLeafName,
        };
        return;
      }
      if (leaf.locationID) updateLevel(leaf.locationID);
    });
  }

  updateLevel(newTree);
  return newTree;
}

function deleteFromTree(root, deleteId) {
  function updateLevel(leaves) {
    const newLeaves = [];
    leaves.forEach(leaf => {
      const newLeaf = leaf.locationID
        ? { ...leaf, locationID: updateLevel(leaf.locationID) }
        : leaf;
      if (leaf.id !== deleteId) {
        newLeaves.push(newLeaf);
      }
    });
    return newLeaves;
  }

  return updateLevel(root);
}

function addChild(root, parentId) {
  function updateLevel(leaves) {
    const newLeaves = [];
    leaves.forEach(leaf => {
      if (leaf.locationID) {
        leaf.locationID = updateLevel(leaf.locationID);
        if (leaf.id === parentId) leaf.locationID.push(getNewLeaf());
      } else if (leaf.id === parentId) {
        leaf.locationID = [getNewLeaf()];
      }
      newLeaves.push(leaf);
    });
    return newLeaves;
  }

  return updateLevel(root);
}

function Leaf({ level, data, root, onChange, children }) {
  return (
    <div style={{ marginLeft: level * 20, marginTop: 10 }}>
      <TextInput
        width={240}
        schema={{ name: get(data, 'name') }}
        onChange={newName => {
          onChange(updateTree(root, data.id, newName));
        }}
        value={get(data, 'name')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => {
                  onChange(addChild(root, data.id));
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
}

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
  ...rest
}) {
  console.log(value);
  return (
    <div {...rest}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">
          <FormattedMessage id="REGION_EDITOR" />
        </Typography>
        <Button
          onClick={() => {
            onChange([getNewLeaf(), ...value]);
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
