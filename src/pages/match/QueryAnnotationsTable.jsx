import React from 'react';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';

const columns = [
  {
    name: 'index',
    labelId: 'ANNOTATION',
    options: {
      customBodyRender: i => `${i + 1}`,
    },
  },
  {
    name: 'asset_filename',
    labelId: 'FILENAME',
    align: 'left',
  },
  {
    name: 'viewpoint',
    labelId: 'VIEWPOINT',
    align: 'left',
    options: {
      cellRenderer: cellRendererTypes.viewpoint,
    },
  },
  {
    name: 'topScore',
    labelId: 'SCORE',
    align: 'left',
    options: {
      cellRenderer: cellRendererTypes.float,
    },
  },
];

export default function QueryAnnotationsTable({
  queryAnnotations,
  selectedQueryAnnotation,
  setSelectedQueryAnnotation,
}) {
  return (
    <DataDisplay
      idKey="guid"
      title="Query annotations"
      data={queryAnnotations}
      // variant="secondary"
      columns={columns}
      hideDownloadCsv
      hideFilterColumns
      selectionControlled
      selectedRow={selectedQueryAnnotation?.guid}
      onSelectRow={nextSelection => {
        if (nextSelection) {
          setSelectedQueryAnnotation(nextSelection);
        }
      }}
      tableContainerStyles={{ maxHeight: 300 }}
    />
  );
}
