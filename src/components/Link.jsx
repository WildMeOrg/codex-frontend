import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';

export default function Link({
  children,
  href,
  style,
  disabled = false,
  noUnderline = false,
  external = false,
  newTab = false,
  onClick,
  ...rest
}) {
  const theme = useTheme();

  const styles = {
    color: disabled ? theme.palette.text.disabled : 'unset',
    textDecoration: noUnderline ? 'unset' : 'underline',
    cursor: disabled ? 'default' : 'pointer',
    ...style,
  };

  if (disabled) {
    return (
      <div style={styles} {...rest}>
        {children}
      </div>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noreferrer' : undefined}
        style={styles}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={href}
      style={styles}
      onClick={onClick}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      {...rest}
    >
      {children}
    </RouterLink>
  );
}
