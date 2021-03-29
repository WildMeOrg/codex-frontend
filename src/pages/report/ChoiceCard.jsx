import React from 'react';
import Paper from '@material-ui/core/Paper';
import Text from '../../components/Text';
import Link from '../../components/Link';

export default function ChoiceCard({
  renderIcon,
  labelId,
  descriptionId,
  href,
  style,
}) {
  return (
    <Link to={href} noUnderline>
      <Paper
        style={{
          maxWidth: 240,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '32px 16px',
          cursor: 'pointer',
          margin: 12,
          minHeight: 380,
          ...style,
        }}
      >
        {renderIcon()}
        <Text variant="h6" style={{ marginTop: 16 }} id={labelId} />
        <Text
          style={{ marginTop: 12 }}
          id={descriptionId}
          variant="caption"
        />
      </Paper>
    </Link>
  );
}
