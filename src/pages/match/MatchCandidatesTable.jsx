import React from 'react';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';

const columns = [
  {
    name: 'index',
    labelId: 'ANNOTATION',
    options: {
      customBodyRender: i => `C${i + 1}`,
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
    name: 'score',
    labelId: 'SCORE',
    align: 'left',
    options: {
      cellRenderer: cellRendererTypes.float,
    },
  },
];

export default function MatchCandidatesTable({
  matchCandidates,
  // selectedMatchCandidate,
  setSelectedMatchCandidate,
}) {

  return (
    <DataDisplay
      idKey="guid"
      title="Match candidates"
      data={matchCandidates}
      // variant="secondary"
      columns={columns}
      noResultsTextId="NO_MATCH_CANDIDATES"
      hideDownloadCsv
      hideFilterColumns
      // initiallySelectedRow={selectedMatchCandidate?.guid}
      onSelectRow={nextSelection => {
        if (nextSelection) {
          setSelectedMatchCandidate(nextSelection);
        }
      }}
    />
  );
}
