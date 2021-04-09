import React, { useMemo, useState } from 'react';
import { get } from 'lodash-es';

import CardContainer from '../../components/cards/CardContainer';
import MetadataCard from '../../components/cards/MetadataCard';
import GpsCard from '../../components/cards/GpsCard';
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

  const editableFields = mergedFields.filter(f => f.editable);

  const gpsField = mergedFields.find(field => field.id === 'gps');
  const gps = gpsField && get(gpsField, 'value');

  return (
    <CardContainer>
      <EditSightingMetadata
        open={editing}
        onClose={() => setEditing(false)}
        onSubmit={() => setEditing(false)}
        metadata={editableFields}
        error={null}
      />
      <MetadataCard
        editable
        metadata={mergedFields}
        onEdit={() => setEditing(true)}
      />
      {gps && <GpsCard lat={gps[0]} lng={gps[1]} />}
    </CardContainer>
  );
}
