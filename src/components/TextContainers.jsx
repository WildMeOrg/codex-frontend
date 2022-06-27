import React from 'react';
import Typography from '@material-ui/core/Typography';

export function Header1({ children, ...rest }) {
  return (
    <Typography component="h1" variant="h4" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

export function Header2({ children, ...rest }) {
  return (
    <Typography component="h2" variant="h5" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

export function Header3({ children, ...rest }) {
  return (
    <Typography component="h3" variant="h6" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

export function Header4({ children, ...rest }) {
  return (
    <Typography
      component="h4"
      variant="subtitle2"
      gutterBottom
      style={{ fontStyle: 'italic', fontWeight: 'bold' }}
      {...rest}
    >
      {children}
    </Typography>
  );
}

export function Paragraph({ children, ...rest }) {
  return (
    <Typography paragraph {...rest}>
      {children}
    </Typography>
  );
}

export function ListItem({ children, ...rest }) {
  return (
    <Typography component="li" {...rest}>
      {children}
    </Typography>
  );
}

export function Definition({ children }) {
  return <dfn style={{ fontStyle: 'normal' }}>{children}</dfn>;
}
