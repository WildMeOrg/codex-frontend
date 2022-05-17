import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

import useViewLabel from '../../../hooks/useViewLabel';
import useDescription from '../../../hooks/useDescription';
import Text from '../../Text';

export default function InputRow({
  containerStyles = {},
  containerProps = {},
  schema,
  children,
  loading = false,
}) {
  const viewLabel = useViewLabel(schema);
  const description = useDescription(schema);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 12,
        marginTop: 20,
        width: '100%',
        containerStyles,
      }}
      {...containerProps}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 400,
          marginBottom: 12,
        }}
      >
        <Text>{viewLabel}</Text>
        {description ? (
          <Text variant="caption" style={{ maxWidth: '80%' }}>
            {description}
          </Text>
        ) : null}
      </div>
      {loading ? <Skeleton height={36} width={180} /> : children}
    </div>
  );
}
