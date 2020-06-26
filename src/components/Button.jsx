import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

const colorMap = {
  primary: 'rgb(109, 41, 208)',
  secondary: 'rgb(79, 84, 255)',
  tertiary: 'rgb(232, 85, 0)',
};

export default function CustomButton({
  children,
  display = 'panel',
  loading = false,
  style,
  disabled,
  ...rest
}) {
  let variant = undefined; // eslint-disable-line
  let color = undefined; // eslint-disable-line
  const roleStyles = {};

  if (display === 'back') {
    return (
      <Button
        size="small"
        startIcon={<BackIcon />}
        disabled={disabled}
        {...rest}
      >
        {children}
      </Button>
    );
  }

  if (
    ['primary', 'secondary', 'tertiary', 'subtle'].includes(display)
  ) {
    variant = 'contained';

    if (display === 'subtle') {
      color = 'default';
    } else {
      roleStyles.backgroundColor = colorMap[display];
      roleStyles.color = 'white';
    }
  }

  if (display === 'panel') {
    variant = 'outlined';
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
