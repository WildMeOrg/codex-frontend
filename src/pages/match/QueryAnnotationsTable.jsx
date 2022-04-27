import React from 'react';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';

const columns = [
  {
    name: 'index',
    labelId: 'ANNOTATION',
    options: {
      customBodyRender: i => `Q${i + 1}`,
    }
  },
  // {
  //   name: 'filename',
  //   labelId: 'FILENAME',
  // },
  {
    name: 'viewpoint',
    labelId: 'VIEWPOINT',
    align: 'left',
  },
  {
    name: 'top_score',
    labelId: 'SCORE',
    align: 'left',
    options: {
      cellRenderer: cellRendererTypes.float,
    },
  },
];

export default function QueryAnnotationsTable({
  queryAnnotations,
  // selectedQueryAnnotation,
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
      onSelectRow={nextSelection => {
        if (nextSelection) {
          setSelectedQueryAnnotation(nextSelection);
        }
      }}
    />
  );
}
