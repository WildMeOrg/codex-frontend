import React, { useMemo, useState } from 'react';
import { get } from 'lodash-es';

import CardContainer from '../../components/cards/CardContainer';
import MetadataCard from '../../components/cards/MetadataCard';
import GpsCard from '../../components/cards/GpsCard';
import StatusCard from './statusCard/StatusCard';
import EditSightingMetadata from './EditSightingMetadata';

export default function OverviewContent({
  sightingId,
  metadata = [],
  sightingData,
  refreshSightingData,
  pending,
}) {
  const [editing, setEditing] = useState(false);

  const viewableMetadata = metadata.filter(
    field =>
      !field.hideOnMetadataCard && Boolean(get(field, 'value')),
  );
  const editableFields = useMemo(
    () =>
      metadata.filter(
        field => field.editable && !field.hideOnMetadataCard,
      ),
    [metadata],
  );

  const gpsField = viewableMetadata.find(
    field => field.name === 'gps',
  );
  const gps = get(gpsField, 'value', []);
  const isGpsAllNulls =
    gps.filter(entry => entry == null).length === gps.length;

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
          {!isGpsAllNulls && <GpsCard lat={gps[0]} lng={gps[1]} />}
        </CardContainer>
      )}
    </div>
  );
}
