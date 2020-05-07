import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import IndividualInput from './IndividualInput';

export default function RelationshipsInput({
  schema,
  value: relationships,
  onChange,
  ...rest
}) {
  return (
    <div>
      {relationships.map(relationship => {
        const otherRelationships = relationships.filter(
          r => r.tempId !== relationship.tempId,
        );

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 12,
            }}
            key={relationship.tempId}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                <FormattedMessage id="RELATIONSHIP" />
              </Typography>
              <IconButton
                size="small"
                onClick={() => onChange(otherRelationships)}
              >
                <DeleteIcon style={{ color: '#DC2113' }} />
              </IconButton>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'flex-end' }}
              {...rest}
            >
              <FormControl style={{ width: 100, marginRight: 8 }}>
                <InputLabel>
                  <FormattedMessage id="RELATIONSHIP_TYPE" />
                </InputLabel>
                <Select
                  labelId="relationship-type-selector-label"
                  id="relationship-type-selector"
                  value={relationship.type}
                  onChange={e => {
                    const newType = e.target.value;
                    onChange([
                      ...otherRelationships,
                      { ...relationship, type: newType },
                    ]);
                  }}
                >
                  {schema.choices.map(option => (
                    <MenuItem value={option.type} key={option.type}>
                      <FormattedMessage id={option.labelId} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IndividualInput
                value={relationship.targetIndividualId}
                onChange={targetIndividualId => {
                  onChange([
                    ...otherRelationships,
                    { ...relationship, targetIndividualId },
                  ]);
                }}
              />
            </div>
          </div>
        );
      })}
      <Button
        style={{ marginTop: 16 }}
        onClick={() => {
          onChange([
            ...relationships,
            {
              targetIndividualId: null,
              direction: null,
              type: '',
              tempId: Date.now(),
            },
          ]);
        }}
        size="small"
        variant="outlined"
      >
        <FormattedMessage
          id={
            relationships.length > 0
              ? 'ADD_ANOTHER_RELATIONSHIP'
              : 'ADD_RELATIONSHIP'
          }
        />
      </Button>
    </div>
  );
}
