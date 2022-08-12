import React, { useState } from 'react';

import SinglePointDialog from '../../../components/dialogs/SinglePointDialog';
import Text from '../../../components/Text';

const buttonAsLinkStyles = {
  textTransform: 'none',
  border: 'none',
  padding: 0,
  textDecoration: 'underline',
  cursor: 'pointer',
  backgroundColor: 'transparent',
};

export default function FormattedLocationWithDialog({
  location,
  textProps,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { label, decimalLatitude, decimalLongitude } = location || {};

  const labelProps = {};
  if (label) labelProps.children = label;
  else labelProps.id = 'REGION_LABEL_NOT_FOUND';

  if (!decimalLatitude || !decimalLongitude) {
    return <Text variant="inherit" {...labelProps} {...textProps} />;
  }

  return (
    <>
      <SinglePointDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        lat={decimalLatitude}
        lng={decimalLongitude}
      />
      <Text
        component="button"
        variant="inherit"
        {...labelProps}
        style={buttonAsLinkStyles}
        {...textProps}
        onClick={() => setDialogOpen(true)}
      />
    </>
  );
}
