import React from 'react';

import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { cellRendererTypes } from '../../components/dataDisplays/cellRenderers';
import ActionIcon from '../../components/ActionIcon';

const columns = [
  {
    name: 'index',
    labelId: 'ANNOTATION',
    options: {
      customBodyRender: i => `C${i + 1}`,
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
  },
  {
    name: 'score',
    labelId: 'SCORE',
    align: 'left',
    options: {
      cellRenderer: cellRendererTypes.float,
    },
  },
  {
    name: 'sighting_guid',
    labelId: 'VIEW_SIGHTING',
    options: {
      customBodyRender: guid => {
        return (
          <ActionIcon
            labelId="VIEW"
            variant="view"
            href={`/sightings/${guid}`}
            linkProps={{ newTab: true }}
          />
        );
      },
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
