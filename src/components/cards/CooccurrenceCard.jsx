import React from 'react';
import { format } from 'date-fns';
import DataDisplay from '../dataDisplays/DataDisplay';
import Link from '../Link';
import Card from './Card';

export default function CooccurrenceCard({
  title,
  titleId = 'COOCCURRENCES',
  data,
}) {
  return (
    <Card title={title} titleId={titleId}>
      <DataDisplay
        noTitleBar
        columns={[
          {
            name: 'individual',
            label: 'Individual',
            options: {
              customBodyRender: value => (
                <Link href={`/individuals/${value}`}>{value}</Link>
              ),
            },
          },
          {
            name: 'count',
            label: 'Count',
          },
          {
            name: 'lastSeen',
            label: 'Last seen together',
            options: {
              customBodyRender: value => format(value, 'MMM d, yyyy'),
              getStringValue: value => format(value, 'MMM d, yyyy'),
            },
          },
        ]}
        data={data}
      />
    </Card>
  );
}
