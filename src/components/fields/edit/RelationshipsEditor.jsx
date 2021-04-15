import React from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { sortBy } from 'lodash-es';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import IndividualEditor from './IndividualEditor';
import DeleteButton from '../../DeleteButton';
import Button from '../../Button';
import Text from '../../Text';

export default function RelationshipsEditor({
  schema,
  value: relationships,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  const sortedRelationships = sortBy(relationships, 'timeCreated');

  return (
    <div>
      {sortedRelationships.map(relationship => {
        const otherRelationships = sortedRelationships.filter(
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
              <Text variant="subtitle2" id="RELATIONSHIP" />
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
              <IndividualEditor
                schema={schema}
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
      {relationships && (
        <Button
          id={
            relationships.length > 0
              ? 'ADD_ANOTHER_RELATIONSHIP'
              : 'ADD_RELATIONSHIP'
          }
          style={{ marginTop: 16 }}
          onClick={() => {
            onChange([
              ...sortedRelationships,
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
        />
      )}
    </div>
  );
}
