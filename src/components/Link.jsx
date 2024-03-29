import React, { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';

function Link(
  {
    children,
    href,
    style,
    disabled = false,
    noUnderline = false,
    external = false,
    newTab = false,
    onClick,
    ...rest
  },
  ref,
) {
  const theme = useTheme();

  const styles = {
    color: disabled ? theme.palette.text.disabled : 'unset',
    textDecoration: noUnderline ? 'unset' : 'underline',
    cursor: disabled ? 'default' : 'pointer',
    ...style,
  };

  if (disabled) {
    return (
      <div style={styles} ref={ref} {...rest}>
        {children}
      </div>
    );
  }

  if (external) {
    return (
      /* eslint-disable react/jsx-no-target-blank */
      /* This rule is actually followed, but eslint doesn't understand the ternary */
      <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noreferrer' : undefined}
        style={styles}
        onClick={onClick}
        ref={ref}
        {...rest}
      >
        {children}
      </a>
      /* eslint-enable react/jsx-no-target-blank */
    );
  }

  return (
    <RouterLink
      to={href}
      style={styles}
      onClick={onClick}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      ref={ref}
      {...rest}
    >
      {children}
    </RouterLink>
  );
}

export default forwardRef(Link);
