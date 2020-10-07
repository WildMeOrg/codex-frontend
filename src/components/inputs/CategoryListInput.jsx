import React from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { get, sortBy } from 'lodash-es';
import TextInput from './TextInput';
import DeleteButton from '../DeleteButton';
import Button from '../Button';

export default function CategoryListInput({
  schema,
  value: categories,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  const sortedCategories = categories
    ? sortBy(categories, 'timeCreated')
    : [];

  return (
    <div {...rest}>
      {sortedCategories.map(category => {
        const otherCategories = sortedCategories.filter(
          c => c.id !== category.id,
        );

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 12,
            }}
            key={category.id}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextInput
                schema={{
                  labelId: 'CATEGORY',
                }}
                value={get(category, 'label', '')}
                onChange={newLabel => {
                  onChange([
                    ...otherCategories,
                    { ...category, label: newLabel },
                  ]);
                }}
              />
              <DeleteButton
                onClick={() => onChange(otherCategories)}
              />
            </div>
          </div>
        );
      })}
      <Button
        style={{ marginTop: 16 }}
        onClick={() => {
          onChange([
            ...sortedCategories,
            {
              label: '',
              id: uuid(),
              timeCreated: Date.now(),
            },
          ]);
        }}
        size="small"
      >
        <FormattedMessage
          id={
            sortedCategories.length > 0
              ? 'ADD_ANOTHER_CATEGORY'
              : 'ADD_CATEGORY'
          }
        />
      </Button>
    </div>
  );
}
