import React, { useState } from 'react';
import { flattenDeep, get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import TextInput from './TextInput';

const textInputWidth = 140;

function Core({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
}

function updateTree(tree, leafId, newLeafName) {
  const flatTree = flattenDeep(tree);
  const oldLeaf = flatTree.find(leaf => leaf.id === leafId);
  const newLeaf = { ...oldLeaf, name: newLeafName };

  const newTree = [...tree];
  function updateLevel(leaves) {
    leaves.forEach((leaf, i) => {
      if (leaf.id === leafId) leaves[i] = newLeaf;
      if (leaf.locationID) updateLevel(leaf.locationID);
    });
  }

  updateLevel(newTree);
  return newTree;
}

function addToTree(tree, parentLeaf, newLeaf) {
  const newTree = [...tree];
  console.log(tree, parentLeaf, newLeaf);
  function updateLevel(parent) {
    if (parent.id === parentLeaf.id) {
      if (!parent.locationID) parent.locationID = [];
      parent.locationID.push(newLeaf);
    }
    parent.locationID.forEach(leaf => {
      if (leaf.locationID) updateLevel(leaf.locationID);
    });
  }

  updateLevel({ id: 'WORLD', name: 'WORLD', locationID: tree });
  return newTree;
}

export default function TreeViewEditor(props) {
  const {
    schema,
    required,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

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

  function renderLevel(leaves, parent) {
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
                  onChange(updateTree(value, leaf.id, newName))
                }
                value={leaf.name}
              />
            }
          >
            {leaf.locationID && renderLevel(leaf.locationID, leaf)}
          </TreeItem>
        ))}
        <Button
          onClick={() => {
            const newLeaf = {
              id: uuid(),
              name: '',
            };
            onChange(addToTree(value, parent, newLeaf));
          }}
          style={{ marginLeft: 20 }}
          size="small"
        >
          <FormattedMessage id="NEW_REGION" />
        </Button>
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
          {renderLevel(value, { id: 'WORLD', name: 'WORLD', locationID: value })}
        </TreeItem>
      </TreeView>
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
    </Core>
  );
}
