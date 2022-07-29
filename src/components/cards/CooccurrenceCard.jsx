import React from 'react';
import DataDisplay from '../dataDisplays/DataDisplay';
import Link from '../Link';
import Card from './Card';
import { cellRendererTypes } from '../dataDisplays/cellRenderers';

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
          { name: 'count', label: 'Count' },
          {
            name: 'lastSeen',
            label: 'Last seen together',
            options: {
              cellRenderer: cellRendererTypes.date,
              cellRendererProps: { accessor: 'lastSeen' },
            },
          },
        ]}
        data={data}
        tableContainerStyles={{ maxHeight: 600 }}
      />
    </Card>
  );
}
