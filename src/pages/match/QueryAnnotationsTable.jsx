import React from 'react';
import DataDisplay from '../../components/dataDisplays/DataDisplay';

const columns = [
  {
    // name: 'filename',
    name: 'image_url',
    labelId: 'FILENAME',
  },
  {
    name: 'viewpoint',
    labelId: 'VIEWPOINT',
  },
  {
    name: 'top_score',
    labelId: 'SCORE',
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
      onSelectRow={selectedQueryAnnotation => {
        setSelectedQueryAnnotation(selectedQueryAnnotation);
      }}
    />
  );
}
