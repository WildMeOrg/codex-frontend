import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

function Core({
  children,
  display = 'panel',
  loading = false,
  style,
  disabled,
  size,
  ...rest
}) {
  const theme = useTheme();

  let variant = undefined; // eslint-disable-line
  let color = undefined; // eslint-disable-line
  let roleStyles = {};

  if (display === 'back') {
    return (
      <Button
        size="small"
        startIcon={<BackIcon />}
        disabled={disabled}
        style={{
          padding: '4px 16px',
          ...style,
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  }

  if (
    [
      'primary',
      'secondary',
      'tertiary',
      'subtle',
      'marketing',
    ].includes(display)
  ) {
    variant = 'contained';
  }

  if (['tertiary', 'subtle', 'panel', 'basic'].includes(display)) {
    color = 'default';
  } else {
    color = display;
  }

  if (display === 'panel') {
    variant = 'outlined';
  }

  if (display === 'marketing') {
    roleStyles = {
      padding: '20px 32px',
    };
    color = 'primary';
  }

  if (display === 'secondary') {
    roleStyles = {
      color: theme.palette.text.primary,
    };
  }

  if (display === 'link') {
    roleStyles = {
      background: 'none!important',
      border: 'none',
      padding: '0!important',
      color: '#069',
      textDecoration: 'underline',
      cursor: 'pointer',
      backgroundColor: 'transparent',
    };
  }

  if (disabled) {
    delete roleStyles.backgroundColor;
    delete roleStyles.color;
  }

  return (
    <Button
      color={color}
      variant={variant}
      disabled={disabled}
      style={{ ...roleStyles, ...style }}
      size={size}
      {...rest}
    >
      {loading ? (
        <CircularProgress size={24} style={{ color: 'white' }} />
      ) : (
        children
      )}
    </Button>
  );
}

export default function CustomButton({
  id,
  domId = undefined,
  values,
  children,
  ...rest
}) {
  if (!id)
    return (
      <Core id={domId} {...rest}>
        {children}
      </Core>
    );
  return (
    <Core id={domId} {...rest}>
      <FormattedMessage id={id} values={values} />
    </Core>
  );
}
