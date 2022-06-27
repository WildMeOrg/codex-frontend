import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import { v4 as uuid } from 'uuid';
import { cloneDeep, get } from 'lodash-es';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TreeView from '@material-ui/lab/TreeView';
import NewChildIcon from '@material-ui/icons/KeyboardReturn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import TextInput from './TextInput';
import DeleteButton from '../DeleteButton';
import Button from '../Button';
import { flattenTree } from '../../utils/treeUtils';

const textInputWidth = 200;

function getNewLeaf() {
  return {
    id: uuid(),
    name: '',
  };
}

const Core = function({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
};

function addChild(tree, parentId) {
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

  return updateLevel(tree);
}

function deleteFromTree(tree, deleteId) {
  function updateLevel(leaves) {
    const newLeaves = [];
    leaves.forEach(leaf => {
      if (leaf.id !== deleteId) {
        if (leaf.locationID)
          leaf.locationID = updateLevel(leaf.locationID);
        newLeaves.push(leaf);
      }
    });
    return newLeaves;
  }

  return updateLevel(tree);
}

function updateTree(tree, leafId, newLeafName) {
  const flatTree = flattenTree(tree);
  const oldLeaf = flatTree.find(leaf => leaf.id === leafId);

  const newTree = cloneDeep(tree);
  function updateLevel(leaves) {
    leaves.forEach((leaf, i) => {
      if (leaf.id === leafId) {
        const newLeaf = { ...oldLeaf, name: newLeafName };
        leaves[i] = newLeaf;
      }
      if (leaf.locationID) updateLevel(leaf.locationID);
    });
  }

  updateLevel(newTree);
  return newTree;
}

export default function LocationIdInput(props) {
  const {
    schema,
    required,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

  const baseValue = get(value, 'locationID', []);

  const intl = useIntl();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  function setNewValue(newBaseValue) {
    onChange({ ...value, locationID: newBaseValue });
  }

  function renderLevel(leaves, level) {
    return (
      <>
        {leaves.map(leaf => (
          <TreeItem
            key={leaf.id}
            nodeId={leaf.name}
            onLabelClick={e => {
              e.preventDefault();
            }}
            label={
              <TextInput
                style={{ marginTop: 10 }}
                width={textInputWidth}
                schema={{ name: leaf.id }}
                onChange={newName =>
                  setNewValue(updateTree(baseValue, leaf.id, newName))
                }
                value={leaf.name}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setNewValue(addChild(baseValue, leaf.id));
                        }}
                      >
                        <NewChildIcon
                          style={{
                            transform:
                              'rotateX(180deg) rotateZ(180deg)',
                          }}
                        />
                      </IconButton>
                      <DeleteButton
                        onClick={() => {
                          setNewValue(
                            deleteFromTree(baseValue, leaf.id),
                          );
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            }
          >
            {leaf.locationID &&
              renderLevel(leaf.locationID, level + 1)}
          </TreeItem>
        ))}
        {level === 0 && (
          <Button
            onClick={() => {
              setNewValue([...baseValue, getNewLeaf()]);
            }}
            style={{ marginLeft: 20 }}
            size="small"
          >
            <FormattedMessage id="NEW_REGION" />
          </Button>
        )}
      </>
    );
  }

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  return (
    <Core schema={schema} required={required} width={width}>
      <TreeView
        style={{ marginTop: 20 }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        {...rest}
      >
        <TreeItem
          nodeId="IGNORE"
          label={intl.formatMessage(
            { id: 'EDIT_OBJECT' },
            { object: getLabel(schema) },
          )}
        >
          {renderLevel(baseValue, 0)}
        </TreeItem>
      </TreeView>
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </Core>
  );
}
