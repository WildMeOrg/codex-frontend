import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import LabeledInput from './LabeledInput';

export default function InputRow({
  containerStyles = {},
  containerProps = {},
  label,
  labelId,
  description,
  descriptionId,
  required,
  children,
  ...rest
}) {
  const showDescription = description || descriptionId;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        width: '100%',
        containerStyles,
      }}
      {...containerProps}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 20,
          minWidth: 200,
          maxWidth: 400,
          marginBottom: 12,
        }}
      >
        <Typography>
          {labelId ? <FormattedMessage id={labelId} /> : label}
          {required && ' *'}
        </Typography>
        {showDescription && (
          <Typography variant="caption">
            {descriptionId ? (
              <FormattedMessage id={descriptionId} />
            ) : (
              description
            )}
          </Typography>
        )}
      </div>
      {children || (
        <LabeledInput minimalLabels width={220} {...rest} />
      )}
    </div>
  );
}
