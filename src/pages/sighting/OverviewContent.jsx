import React, { useState } from 'react';
import { get } from 'lodash-es';

import CardContainer from '../../components/cards/CardContainer';
import MetadataCard from '../../components/cards/MetadataCardNew';
import GpsCard from '../../components/cards/GpsCard';
import StatusCard from './statusCard/StatusCard';
import EditSightingMetadata from './EditSightingMetadata';

export default function OverviewContent({
  sightingId,
  metadata,
  sightingData,
  refreshSightingData,
  pending,
}) {
  const [editing, setEditing] = useState(false);

  const viewableMetadata = metadata.filter(
    field => !field.hideOnMetadataCard,
  );
  const editableFields = viewableMetadata.filter(
    field => field.editable,
  );

  const gpsField = viewableMetadata.find(
    field => field.name === 'gps',
  );
  const gps = gpsField && get(gpsField, 'value');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {metadata ? (
        <EditSightingMetadata
          open={editing}
          sightingId={sightingId}
          onClose={() => setEditing(false)}
          metadata={editableFields}
          refreshSightingData={refreshSightingData}
          pending={pending}
        />
      ) : null}
      <CardContainer size="small">
        <MetadataCard
          editable={Boolean(viewableMetadata)}
          metadata={viewableMetadata}
          onEdit={() => setEditing(true)}
        />
      </CardContainer>
      {gps && (
        <CardContainer>
          <StatusCard sightingData={sightingData} />
          <GpsCard lat={gps[0]} lng={gps[1]} />
        </CardContainer>
      )}
    </div>
  );
}
