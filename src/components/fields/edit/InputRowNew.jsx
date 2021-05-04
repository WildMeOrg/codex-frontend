import React from 'react';
import useLabel from '../../../hooks/useLabel';
import useDescription from '../../../hooks/useDescription';
import Text from '../../Text';

export default function InputRow({
  containerStyles = {},
  containerProps = {},
  schema,
  children,
}) {
  const label = useLabel(schema);
  const description = useDescription(schema);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
          width: 400,
          marginBottom: 12,
        }}
      >
        <Text>{label}</Text>
        {description ? (
          <Text variant="caption" style={{ maxWidth: '80%' }}>
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </div>
  );
}
