import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import fieldTypes, {
  fieldTypeInfo,
} from '../../../constants/fieldTypesNew';

const fieldTypeCategories = [
  {
    labelId: 'BASIC_INPUTS',
    fields: [
      fieldTypes.boolean,
      fieldTypes.date,
      fieldTypes.string,
      fieldTypes.longstring,
      fieldTypes.float,
      fieldTypes.integer,
    ],
  },
  {
    labelId: 'SPECIAL_INPUTS',
    fields: [
      fieldTypes.daterange,
      fieldTypes.select,
      fieldTypes.multiselect,
      fieldTypes.file,
      fieldTypes.individual,
      fieldTypes.latlong,
      fieldTypes.feetmeters,
    ],
  },
];

export default function FieldTypeSelector({ onChange, field }) {
  const intl = useIntl();

  return (
    <FormControl style={{ width: 220, marginTop: 8 }}>
      <InputLabel>
        <FormattedMessage id="FIELD_TYPE" />
      </InputLabel>
      <Select
        native
        labelId="field-type-selector-label"
        id="field-type-selector"
        value={get(field, ['schema', 'displayType'], '')}
        onChange={e => {
          const newType = e.target.value;
          const newFieldTypeSpecifier = fieldTypeInfo[newType];

          const newField = {
            ...field,
            multiple: newFieldTypeSpecifier.backendMultiple,
            type: newFieldTypeSpecifier.backendType,
            schema: {
              ...field.schema,
              displayType: newType,
            },
          };

          const newConfiguration = get(
            newFieldTypeSpecifier,
            'configuration',
            [],
          );

          newConfiguration.forEach(configurableProperty => {
            newField.schema[configurableProperty.value] =
              configurableProperty.defaultValue;
          });

          onChange(newField);
        }}
      >
        {fieldTypeCategories.map(category => (
          <optgroup
            label={intl.formatMessage({
              id: category.labelId,
            })}
            key={category.labelId}
          >
            {category.fields.map(categoryField => {
              const option = fieldTypeInfo[categoryField];
              return (
                <option value={option.value} key={option.value}>
                  {intl.formatMessage({
                    id: option.labelId,
                  })}
                </option>
              );
            })}
          </optgroup>
        ))}
      </Select>
    </FormControl>
  );
}
