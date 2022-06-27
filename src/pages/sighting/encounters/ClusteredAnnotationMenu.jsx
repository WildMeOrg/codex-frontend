import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoveAnnotationDialog from './MoveAnnotationDialog';

export default function ClusteredAnnotationMenu({
  id,
  anchorEl,
  open,
  onClose,
  annotation,
  sightingData,
  pending,
}) {
  const [annotationToMove, setAnnotationToMove] = useState(null);

  return (
    <>
      <MoveAnnotationDialog
        open={Boolean(annotationToMove)}
        onClose={() => setAnnotationToMove(null)}
        annotation={annotation}
        sightingData={sightingData}
        pending={pending}
      />
      <Menu id={id} anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem onClick={() => setAnnotationToMove(annotation)}>
          <FormattedMessage id="MOVE_TO_ANOTHER_CLUSTER" />
        </MenuItem>
      </Menu>
    </>
  );
}
