import React from 'react';

import { FormattedMessage } from 'react-intl';

import CardContainer from '../../components/cards/CardContainer';
import GpsCard from '../../components/cards/GpsCard';
import CustomAlert from '../../components/Alert';

export default function MapInSighting({ latitude, longitude }) {
  if (latitude === undefined || longitude === undefined) {
    // don't want truthy because 0,0 is a valid gps location
    return (
      <CustomAlert
        severity="error"
        style={{ marginTop: 20 }}
        titleId="AN_ERROR_OCCURRED"
        description={<FormattedMessage id="INVALID_GPS" />}
      />
    );
  }

  return (
    <CardContainer>
      <GpsCard lat={latitude} lng={longitude} titleId="" />
    </CardContainer>
  );
}
