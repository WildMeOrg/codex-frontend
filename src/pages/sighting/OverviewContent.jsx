import React, { useMemo, useState } from 'react';
import { get } from 'lodash-es';

import CardContainer from '../../components/cards/CardContainer';
import MetadataCard from '../../components/cards/MetadataCard';
import MetadataDefinitions from './constants/MetadataDefinitions';
import EditSightingMetadata from './EditSightingMetadata';

export default function OverviewContent({ sightingData }) {
  const [editing, setEditing] = useState(false);
  const mergedFields = useMemo(
    () => {
      if (!sightingData) return null;
      return MetadataDefinitions.map(metadatum => ({
        ...metadatum,
        value: metadatum.getData(sightingData),
      }));
    },
    [get(sightingData, 'version')],
  );

  console.log(mergedFields);

  console.log(sightingData);

  return (
    <CardContainer>
      <EditSightingMetadata
        open={editing}
        onClose={() => setEditing(false)}
        onSubmit={() => setEditing(false)}
        error={null}
      />
      <MetadataCard
        editable
        metadata={mergedFields}
        onEdit={() => setEditing(true)}
      />
    </CardContainer>
  );
}
