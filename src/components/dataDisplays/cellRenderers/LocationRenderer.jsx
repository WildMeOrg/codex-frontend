import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import useOptions from '../../../hooks/useOptions';
import StandardDialog from '../../StandardDialog';
import SinglePoint from '../../maps/SinglePoint';
import Button from '../../Button';
import Text from '../../Text';

export default function LocationRenderer({
  datum,
  locatationIdProperty = 'locationId',
  latProperty = 'decimalLatitude',
  lngProperty = 'decimalLongitude',
  freeformProperty = 'verbatimLocality',
}) {
  const intl = useIntl();
  const { regionOptions } = useOptions();
  const [dialogOpen, setDialogOpen] = useState(false);

  const locationId = get(datum, locatationIdProperty);
  const lat = get(datum, latProperty);
  const lng = get(datum, lngProperty);
  const freeform = get(datum, freeformProperty);

  const matchingLocationIdObject = regionOptions.find(
    opt => opt?.value === locationId,
  );
  const regionLabel =
    matchingLocationIdObject?.label ||
    intl.formatMessage({
      id: 'REGION_NAME_REMOVED',
    });
  const text = freeform
    ? `${regionLabel} (${freeform})`
    : regionLabel;

  if (!lat || !lng) return <Text variant="body2">{text}</Text>;

  return (
    <>
      <StandardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        titleId="GPS_TITLE"
      >
        {dialogOpen && (
          <>
            <DialogContent style={{ marginBottom: 24 }}>
              <div style={{ height: 400, width: 480 }}>
                <SinglePoint lat={lat} lng={lng} />
              </div>
            </DialogContent>
            <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
              <Button
                id="CLOSE"
                display="basic"
                onClick={() => setDialogOpen(false)}
              />
            </DialogActions>
          </>
        )}
      </StandardDialog>
      <Button display="link" onClick={() => setDialogOpen(true)}>
        {text}
      </Button>
    </>
  );
}
