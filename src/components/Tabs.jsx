import React from 'react';
import { useIntl } from 'react-intl';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function CustomTabs({
  value,
  onChange,
  variant = 'scrollable',
  items = [],
})
{
  const intl = useIntl();

  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant={variant}
    >
      {items.map(item =>
      {
        const label = item?.labelId ? intl.formatMessage({ id: item.labelId }) : item.label;
        return <Tab key={item.value} label={label} value={item.value} />
      })}
    </Tabs>
  )
}