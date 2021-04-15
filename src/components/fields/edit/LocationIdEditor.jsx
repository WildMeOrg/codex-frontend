import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';

export default function TreeViewInput(props) {
  const {
    schema,
    required,
    value,
    onChange,
    width,
    minimalLabels = false,
    ...rest
  } = props;

  const label = useLabel(schema);
  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const intl = useIntl();
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);

  function renderLevel(leaves) {
    if (!leaves || leaves.length === 0) return null;
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

  return (
    <FormCore schema={schema} width={width}>
      <TreeView
        style={{ marginTop: 20 }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        // multiSelect={multiselect}
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
            { object: label },
          )}
        >
          {renderLevel(schema.choices)}
        </TreeItem>
      </TreeView>
      {showDescription ? (
        <FormHelperText>{description}</FormHelperText>
      ) : null}
      {/* {multiselect && (
        <FormHelperText>
          <FormattedMessage id="SELECT_MULTIPLE_REGIONS_HINT" />
        </FormHelperText>
      )} */}
    </FormCore>
  );
}
