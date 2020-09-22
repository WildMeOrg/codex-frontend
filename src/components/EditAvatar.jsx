import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Button from './Button';
import PhotoUploader from './PhotoUploader';

export default function EditAvatar({ visible, onClose, square }) {
  const [choosingPhoto, setChoosingPhoto] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 300,
    aspect: 1,
  });

  return (
    <Dialog open={visible} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage
          id={choosingPhoto ? 'CHOOSE_PHOTO' : 'CROP_PHOTO'}
          defaultMessage={
            choosingPhoto ? 'Choose photo' : 'Crop photo'
          }
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
          <ReactCrop
            src={imageSrc}
            crop={crop}
            imageStyle={{ width: 300 }}
            onChange={c => setCrop(c)}
            circularCrop={!square}
          />
        )}
      </DialogContent>
      <DialogActions
        style={{ marginTop: 32, padding: '0px 24px 24px 24px' }}
      >
        {choosingPhoto && (
          <Button
            disabled={!imageSrc}
            onClick={() => {
              setChoosingPhoto(false);
            }}
            display="basic"
            autoFocus
          >
            <FormattedMessage id="NEXT_EDIT" />
          </Button>
        )}
        {!choosingPhoto && (
          <>
            <Button
              onClick={() => setChoosingPhoto(true)}
              display="basic"
            >
              <FormattedMessage id="CHANGE_PHOTO" />
            </Button>
            <Button
              display="primary"
              onClick={() => {
                // submit data and wait for response...
                onClose();
              }}
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
