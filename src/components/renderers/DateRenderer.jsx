import React from 'react';
import Typography from '@material-ui/core/Typography';
import { formatDate } from '../../utils/formatters';

export default function DateRenderer({ value }) {
  return <Typography>{formatDate(value)}</Typography>;
}
