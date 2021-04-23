import React from 'react';
import subHours from 'date-fns/subHours';
import StandardDialog from '../../components/StandardDialog';

const changes = [
  {
    user: 'bbob32',
    time: subHours(Date.now(), 2),
    event: 'Edit metadata',
    field: 'Sex',
    previousValue: 'male',
    newValue: 'female',
  },
  {
    user: 'jwolf99',
    time: subHours(Date.now(), 2),
    event: 'Edit metadata',
    field: 'Sex',
    previousValue: 'male',
    newValue: 'female',
  },
  {
    user: 'jwolf99',
    time: subHours(Date.now(), 2),
    event: 'Edit metadata',
    field: 'Sex',
    previousValue: 'male',
    newValue: 'female',
  },
  {
    user: 'bbob32',
    time: subHours(Date.now(), 2),
    event: 'Reported sighting',
    field: 'Sex',
    previousValue: 'male',
    newValue: 'female',
  },
];

export default function SightingHistoryDialog({ open, onClose }) {
  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="SIGHTING_HISTORY"
    >
      Heres to the history!
    </StandardDialog>
  );
}
