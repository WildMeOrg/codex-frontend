import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '../Button';
import SinglePoint from '../maps/SinglePoint';
import StandardDialog from '../StandardDialog';

export default function SinglePointDialog({
  open,
  onClose,
  lat,
  lng,
}) {
  return (
    <StandardDialog open={open} onClose={onClose} titleId="GPS_TITLE">
      {open && (
        <>
          <DialogContent style={{ marginBottom: 24 }}>
            <div style={{ height: 400, width: 480 }}>
              <SinglePoint lat={lat} lng={lng} />
            </div>
          </DialogContent>
          <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
            <Button id="CLOSE" display="basic" onClick={onClose} />
          </DialogActions>
        </>
      )}
    </StandardDialog>
  );
}
