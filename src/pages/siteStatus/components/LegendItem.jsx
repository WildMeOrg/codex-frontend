import React from 'react';
import { useIntl } from 'react-intl';

import Text from '../../../components/Text';

export default function LegendItem({ color, label }) {
  const intl = useIntl();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <dt
        aria-label={intl.formatMessage(
          { id: 'SERVER_COLOR_LEGEND_BOX' },
          { color },
        )}
        style={{
          backgroundColor: color,
          display: 'inline-block',
          width: 12,
          height: 12,
          marginRight: 6,
        }}
      />
      <Text variant="body1" component="dd" display="inline">
        {label}
      </Text>
    </div>
  );
}
