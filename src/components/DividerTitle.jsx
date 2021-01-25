import React from 'react';
import Divider from '@material-ui/core/Divider';
import Text from './Text';

export default function DividerTitle({ titleId, style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 12,
        ...style,
      }}
    >
      <Divider style={{ flexGrow: 1 }} />
      <Text
        variant="h6"
        component="h6"
        style={{ margin: '0 20px' }}
        id={titleId} />
      <Divider style={{ flexGrow: 1 }} />
    </div>
  );
}
