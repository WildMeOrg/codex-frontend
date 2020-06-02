import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

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

export default function LabeledInput(props) {
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
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

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

  function renderLevel(leaves) {
    return leaves.map(leaf => (
      <TreeItem key={leaf.id} nodeId={leaf.id} label={leaf.name}>
        {leaf.locationID && renderLevel(leaf.locationID)}
      </TreeItem>
    ));
  }

  const handleToggle = (event, toggledNodes) => {
    setExpanded(toggledNodes);
  };

  const handleSelect = (event, nodeIds) => {
    if (!schema.multiselect) {
      onChange(nodeIds);
    } else {
      onChange(nodeIds.filter(id => id !== 'IGNORE'));
    }
    setSelected(nodeIds);
  };

  const multiselect = Boolean(schema.multiselect);

  return (
    <Core schema={schema} required={required} width={width}>
      <TreeView
        style={{ marginTop: 20 }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect={multiselect}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        {...rest}
      >
        <TreeItem
          nodeId="IGNORE"
          label={intl.formatMessage(
            { id: 'SELECT_OBJECT' },
            { object: getLabel(schema) },
          )}
        >
          {renderLevel(schema.choices)}
        </TreeItem>
      </TreeView>
      {!minimalLabels && (
        <FormHelperText>{getDescription(schema)}</FormHelperText>
      )}
      {multiselect && (
        <FormHelperText>
          <FormattedMessage id="SELECT_MULTIPLE_REGIONS_HINT" />
        </FormHelperText>
      )}
    </Core>
  );
}
