import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PhotoUploader from './PhotoUploader';

export default function EditAvatar({ visible, onClose }) {
  const [choosingPhoto, setChoosingPhoto] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage
          id="CHOOSE_PHOTO"
          defaultMessage="Choose photo"
        />
      </DialogTitle>
      <DialogContent>
        {choosingPhoto && (
          <PhotoUploader
            onComplete={result => {
              setImageSrc(
                get(result, 'successful.0.uploadURL', null),
              );
            }}
            maxFiles={1}
          />
        )}
        {!choosingPhoto && (
          <img
            src={imageSrc}
            style={{ width: 300 }}
            alt="Uploaded pixels"
          />
        )}
      </DialogContent>
      <DialogActions style={{ marginTop: 32 }}>
        {choosingPhoto && (
          <Button
            disabled={!imageSrc}
            onClick={() => {
              setChoosingPhoto(false);
            }}
            color="primary"
            autoFocus
          >
            <FormattedMessage
              id="NEXT_EDIT"
              defaultMessage="Next: edit"
            />
          </Button>
        )}
        {!choosingPhoto && (
          <>
            <Button
              onClick={() => setChoosingPhoto(true)}
              color="primary"
            >
              <FormattedMessage id="BACK" defaultMessage="Back" />
            </Button>
            <Button
              onClick={() => {
                // submit data and wait for response...
                onClose();
              }}
              color="primary"
              autoFocus
            >
              <FormattedMessage id="SAVE" defaultMessage="Save" />
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
