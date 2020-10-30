import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

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
      <Typography
        variant="h6"
        component="h6"
        style={{ margin: '0 20px' }}
      >
        <FormattedMessage id={titleId} />
      </Typography>
      <Divider style={{ flexGrow: 1 }} />
    </div>
  );
}
