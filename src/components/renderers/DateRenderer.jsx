import React from 'react';
import { formatDate } from '../../utils/formatters';
import Text from '../Text';

export default function DateRenderer({ value }) {
  return <Text>{formatDate(value)}</Text>;
}
