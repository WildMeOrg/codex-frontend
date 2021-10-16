import React from 'react';

import CardContainer from '../../components/cards/CardContainer';
import GpsCard from '../../components/cards/GpsCard';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';

export default function SightingInMap({ latitude, longitude }) {
  if (latitude === undefined || longitude === undefined) {
    // don't want truthy because 0,0 is a valid gps location
    return (
      <SadScreen
        variant="notFoundOcean"
        subtitleId="PAGE_NOT_FOUND"
      />
    );
  }

  return (
    <MainColumn fullWidth>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <CardContainer>
          <GpsCard lat={latitude} lng={longitude} />
        </CardContainer>
      </div>
    </MainColumn>
  );
}
