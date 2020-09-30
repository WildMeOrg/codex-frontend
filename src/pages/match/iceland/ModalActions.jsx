import React, { useState } from 'react';
import { get } from 'lodash-es';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '../../../components/Button';
import LabeledInput from '../../../components/LabeledInput';
import { setStatus, setNotes } from './utils';

export default function ModalActions({ closeModal, acmId, notes }) {
  const [displayedNotes, setDisplayedNotes] = useState(
    get(notes, [acmId], ''),
  );

  return (
    <>
      <LabeledInput
        style={{ margin: '0 0 16px 32px' }}
        schema={{
          labelId: 'NOTES',
          fieldType: 'longstring',
        }}
        width={600}
        value={displayedNotes}
        onChange={setDisplayedNotes}
      />
      <DialogActions>
        <Button
          onClick={() => {
            closeModal();
            setStatus(acmId, 'To do');
            setNotes(acmId, displayedNotes);
          }}
        >
          Mark to do
        </Button>
        <Button
          onClick={() => {
            closeModal();
            setStatus(acmId, 'Flagged for review');
            setNotes(acmId, displayedNotes);
          }}
        >
          Flag for review
        </Button>
        <Button
          display="primary"
          onClick={() => {
            closeModal();
            setStatus(acmId, 'Complete');
            setNotes(acmId, displayedNotes);
          }}
        >
          Mark complete
        </Button>
      </DialogActions>
    </>
  );
}
