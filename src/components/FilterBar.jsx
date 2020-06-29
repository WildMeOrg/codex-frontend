import React from 'react';
import { useIntl } from 'react-intl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

export default function FilterBar({
  onChange,
  value,
  width = 260,
  ...rest
}) {
  const intl = useIntl();
  const placeholder = intl.formatMessage({ id: 'SEARCH' });
  return (
    <Input
      style={{ margin: '16px 0 20px 16px', width }}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      {...rest}
    />
  );
}
