import React, { useState } from 'react';
import { get } from 'lodash-es';

import CardContainer from '../../components/cards/CardContainer';
import MetadataCard from '../../components/cards/MetadataCardNew';
import GpsCard from '../../components/cards/GpsCard';
import EditSightingMetadata from './EditSightingMetadata';

export default function OverviewContent({ metadata }) {
  const [editing, setEditing] = useState(false);

  const editableFields = metadata.filter(field => field.editable);

  const gpsField = metadata.find(field => field.name === 'gps');
  const gps = gpsField && get(gpsField, 'value');

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {/* <EditSightingMetadata
        open={editing}
        onClose={() => setEditing(false)}
        onSubmit={() => setEditing(false)}
        metadata={editableFields}
        error={null}
      /> */}
      <CardContainer size="small">
        <MetadataCard
          editable
          metadata={metadata}
          onEdit={() => setEditing(true)}
        />
      </CardContainer>
      {gps && (
        <CardContainer>
          <GpsCard lat={gps[0]} lng={gps[1]} />
        </CardContainer>
      )}
    </div>
  );
}
