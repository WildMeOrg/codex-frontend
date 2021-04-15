import React, { useState } from 'react';
import { get } from 'lodash-es';

import CardContainer from '../../components/cards/CardContainer';
import MetadataCard from '../../components/cards/MetadataCardNew';
import GpsCard from '../../components/cards/GpsCard';
import StatusCard from './StatusCard';
import EditSightingMetadata from './EditSightingMetadata';

export default function OverviewContent({ sightingId, metadata }) {
  const [editing, setEditing] = useState(false);

  const editableFields = metadata.filter(field => field.editable);

  const gpsField = metadata.find(field => field.name === 'gps');
  const gps = gpsField && get(gpsField, 'value');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {metadata ? (
        <EditSightingMetadata
          open={editing}
          sightingId={sightingId}
          onClose={() => setEditing(false)}
          metadata={editableFields}
        />
      ) : null}
      <CardContainer size="small">
        <MetadataCard
          editable={Boolean(metadata)}
          metadata={metadata}
          onEdit={() => setEditing(true)}
        />
      </CardContainer>
      {gps && (
        <CardContainer>
          <StatusCard />
          <GpsCard lat={gps[0]} lng={gps[1]} />
        </CardContainer>
      )}
    </div>
  );
}
