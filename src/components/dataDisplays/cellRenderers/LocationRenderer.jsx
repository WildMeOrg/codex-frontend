import React, { forwardRef, useState } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import useOptions from '../../../hooks/useOptions';
import Button from '../../Button';
import Text from '../../Text';
import OverflowController from './OverflowController';
import SinglePointDialog from '../../dialogs/SinglePointDialog';

function Core({ value, lat, lng, ...rest }, ref) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!lat || !lng)
    return (
      <Text variant="body2" ref={ref} {...rest}>
        {value}
      </Text>
    );

  return (
    <>
      <SinglePointDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        lat={lat}
        lng={lng}
      />
      <Button
        display="link"
        onClick={() => setDialogOpen(true)}
        ref={ref}
        {...rest}
      >
        {value}
      </Button>
    </>
  );
}

const CoreForwardRef = forwardRef(Core);

export default function LocationRenderer({
  datum,
  locatationIdProperty = 'locationId',
  latProperty = 'decimalLatitude',
  lngProperty = 'decimalLongitude',
  freeformProperty = 'verbatimLocality',
  noWrap = false,
}) {
  const intl = useIntl();
  const { regionOptions } = useOptions();

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

  const coreComponent = (
    <CoreForwardRef value={text} lat={lat} lng={lng} />
  );

  return noWrap ? (
    <OverflowController title={text}>
      {coreComponent}
    </OverflowController>
  ) : (
    coreComponent
  );
}
