import React from 'react';

import { FormattedMessage } from 'react-intl';

import SinglePoint from '../../components/maps/SinglePoint';
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
    <div style={{ height: 400, width: 480 }}>
      <SinglePoint lat={latitude} lng={longitude} />
    </div>
  );
}
