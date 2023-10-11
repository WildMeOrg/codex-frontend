import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import ExploreIcon from '@material-ui/icons/FilterList';

import useOnEnter from '../../hooks/useOnEnter';
import Button from '../Button';
import Text from '../Text';
import Link from '../Link';

export default function SearchButton({
  buttonLabelId,
  inputValue,
  onChangeInputValue,
  onSearch,
  instructionsLabelId,
  linkLabelId,
  linkHref,
  loading,
  children,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  useOnEnter(() => {
    if (inputValue !== '') onSearch(inputValue);
  });

  const closePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        display="primary"
        onClick={event => {
          setAnchorEl(event.currentTarget);
        }}
        style={{
          backgroundColor: theme.palette.grey.A100,
          color: theme.palette.grey.A400,
          marginLeft: 8,
          borderRadius:10000
        }}
        startIcon={<SearchIcon />}
        id={buttonLabelId}
      />
      <Backdrop open={open} />
      <Popover
        marginThreshold={0}
        onClose={closePopover}
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            width: 600,
            borderRadius: 20,
            backgroundColor: theme.palette.grey['200'],
            paddingBottom: 20,
          },
        }}
      >
        <TextField
          style={{ padding: 16 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress
                  size={24}
                  style={{ color: theme.palette.text.primary }}
                />
              </InputAdornment>
            ) : undefined,
            disableUnderline: true,
            autoFocus: true,
            placeholder: intl.formatMessage({
              id: instructionsLabelId,
            }),
          }}
          value={inputValue}
          onChange={e => {
            onChangeInputValue(e.target.value);
          }}
          fullWidth
        />
        {children(closePopover)}
        <Divider />
        <Link
          onClick={closePopover}
          href={linkHref}
          noUnderline
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0 0 16px',
          }}
        >
          <ExploreIcon fontSize="small" />
          <Text
            style={{
              paddingLeft: 8,
              color: theme.palette.text.secondary,
            }}
            id={linkLabelId}
          />
        </Link>
      </Popover>
    </div>
  );
}
