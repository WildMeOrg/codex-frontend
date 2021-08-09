import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';
import FormCore from './FormCore';
import TextField from '@material-ui/core/TextField';
import { FormattedMessage } from 'react-intl';
import Text from '../../Text';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function LocationIdEditor(props) {
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

  function getNumDescendents(targetChoice) {
    let result = 0;
    if (!targetChoice.locationID) return result;
    const childCountsArr = targetChoice.locationID.map(child => {
      return getNumDescendents(child);
    });
    result = targetChoice.locationID.length + childCountsArr.reduce((a, b) => a + b, 0);
    return result;
  }

  function collapseChoices(choices, depth) {
    const result = choices.map(choice => {
      if (!choice.locationID) {
        return { depth, name: ' '.repeat(depth) + choice.name + (getNumDescendents(choice) ? '(' + getNumDescendents(choice).toString() + ')' : ''), id: choice.id };
      }
      const subchoices = [{ depth, name: ' '.repeat(depth) + choice.name + (getNumDescendents(choice) ? ' (' + getNumDescendents(choice).toString() + ')' : ''), id: choice.id }];
      subchoices.push(collapseChoices(choice.locationID, depth + 1));
      return subchoices;
    });
    return result.flat(100);
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
    <Autocomplete
      multiple
      options={collapseChoices(schema.choices, 0).map(result => result.name)}
      renderOption={option => {
        return (
          <Text style={{ paddingLeft: (option.split(' ').length - option.trim().split(' ').length) * 10 }}>
            {option}
          </Text>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          style={{ width: 280 }}
          variant="standard"
          label={<FormattedMessage id="REGION_SELECT" />}
        />
      )}
    />
  );
}
