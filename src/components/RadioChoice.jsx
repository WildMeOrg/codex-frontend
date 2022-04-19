import React from 'react';
import { useIntl } from 'react-intl';

import FormGroup from '@material-ui/core/FormGroup';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import Text from './Text';

export default function RadioChoice({
  title,
  titleId,
  value,
  onChange,
  choices = [],
}) {
  const intl = useIntl();
  const groupName = titleId
    ? intl.formatMessage({ id: titleId })
    : title;
  const groupAriaLabel = `${groupName}-choices`;

  return (
    <FormGroup style={{ margin: '12px 0 24px 12px' }}>
      <Text
        style={{ margin: '24px 0 8px 0', fontWeight: 'bold' }}
        component="legend"
        id={titleId}
      >
        {title}
      </Text>
      <RadioGroup
        aria-label={groupAriaLabel}
        name={groupName}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {choices.map(choice => {
          const choiceLabel = choice?.labelId
            ? intl.formatMessage({ id: choice.labelId })
            : choice.label;
          return (
            <FormControlLabel
              key={choice.value}
              label={choiceLabel}
              control={<Radio />}
              value={choice.value}
            />
          );
        })}
      </RadioGroup>
    </FormGroup>
  );
}
