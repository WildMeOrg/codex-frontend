import React, { useMemo } from 'react';

import Skeleton from '@material-ui/lab/Skeleton';

import Text from '../../components/Text';

export default function DataLineItem({
  label,
  labelId,
  loading,
  blank,
  children,
}) {
  const skeletonWidth = useMemo(() => Math.random() * 80 + 80, []);

  const renderChildren = !blank && !loading;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Text
        id={labelId}
        component="span"
        style={{ fontWeight: 'bold' }}
      >
        {label}
      </Text>
      {loading && <Skeleton width={skeletonWidth} />}
      {renderChildren && children}
    </div>
  );
}
