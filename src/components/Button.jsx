import React, { forwardRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

const Core = function (
  {
    children,
    display = 'panel',
    loading = false,
    style,
    disabled,
    tooltiptext = '',
    size,
    ...rest
  },
  ref,
) {
  const theme = useTheme();

  let variant = undefined; // eslint-disable-line
  let color = undefined; // eslint-disable-line
  let roleStyles = {};
  let spinnerStyles = {
    color: theme.palette.common.white,
  };

  if (display === 'back') {
    return (
      <Tooltip title={tooltiptext}>
        <span>
          <Button
            size="small"
            startIcon={<BackIcon />}
            disabled={disabled}
            style={{
              padding: '4px 16px',
              ...style,
            }}
            ref={ref}
            {...rest}
          >
            {children}
          </Button>
        </span>
      </Tooltip>
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
    spinnerStyles = {
      color: theme.palette.text.secondary,
    };
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
      textTransform: 'none',
      background: 'none',
      border: 'none',
      padding: '0',
      color: theme.palette.text.primary,
      textDecoration: 'underline',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      textAlign: 'right',
      justifyContent: 'right',
      fontSize: '14px',
    };
    return (
      <Tooltip title={tooltiptext}>
        <span>
          <button
            type="button"
            style={{ ...roleStyles, ...style }}
            ref={ref}
            {...rest}
          >
            {loading ? (
              <CircularProgress size={24} style={spinnerStyles} />
            ) : (
              children
            )}
          </button>
        </span>
      </Tooltip>
    );
  }

  if (disabled) {
    delete roleStyles.backgroundColor;
    delete roleStyles.color;
  }

  return (
    <Tooltip title={tooltiptext}>
      <span>
        <Button
          color={color}
          variant={variant}
          disabled={disabled}
          style={{ ...roleStyles, ...style }}
          size={size}
          ref={ref}
          {...rest}
        >
          {loading ? (
            <CircularProgress size={24} style={spinnerStyles} />
          ) : (
            children
          )}
        </Button>
      </span>
    </Tooltip>
  );
};

const CoreForwardRef = forwardRef(Core);

function CustomButton(
  { id, domId = undefined, values, children, ...rest },
  ref,
) {
  if (!id)
    return (
      <CoreForwardRef id={domId} ref={ref} {...rest}>
        {children}
      </CoreForwardRef>
    );
  return (
    <CoreForwardRef id={domId} ref={ref} {...rest}>
      <FormattedMessage id={id} values={values} />
    </CoreForwardRef>
  );
}

export default forwardRef(CustomButton);
