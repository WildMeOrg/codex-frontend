import React from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import IndividualInput from './IndividualInput';
import DeleteButton from '../DeleteButton';
import Button from '../Button';

export default function RelationshipsInput({
  schema,
  value: relationships,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  relationships.sort((a, b) => {
    if (a.timeCreated < b.timeCreated) return -1;
    return 1;
  });

  return (
    <div>
      {relationships.map(relationship => {
        const otherRelationships = relationships.filter(
          r => r.id !== relationship.id,
        );

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 12,
            }}
            key={relationship.id}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                <FormattedMessage id="RELATIONSHIP" />
              </Typography>
              <DeleteButton
                onClick={() => onChange(otherRelationships)}
              />
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
                  value={relationship.value}
                  onChange={e => {
                    const newType = e.target.value;
                    onChange([
                      ...otherRelationships,
                      { ...relationship, value: newType },
                    ]);
                  }}
                >
                  {schema.choices.map(option => (
                    <MenuItem value={option.value} key={option.value}>
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
              value: '',
              id: uuid(),
              timeCreated: Date.now(),
            },
          ]);
        }}
        size="small"
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
