import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '../../components/Link';
import Text from '../../components/Text';


export default function HomeBreadcrumbs({currentPageText, currentPageTextId}) {
  const theme = useTheme();

  const linkStyles = {
    color: theme.palette.text.secondary,
  };
  return (
    <Breadcrumbs
      style={{ margin: '20px 0 20px 20px' }}
      aria-label="breadcrumb"
    >
      <Link href="/" style={linkStyles}>
        <Text id="HOME" />
      </Link>
      <Text id={currentPageTextId}>{currentPageText}</Text>
    </Breadcrumbs>
  );
}