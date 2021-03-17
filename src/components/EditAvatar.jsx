import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, replace } from 'lodash-es';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import usePatchUser from '../models/users/usePatchUser';
import Button from './Button';
import ProfileUploader from './ProfileUploader';

export default function EditAvatar({ visible, onClose, square }) {
  const [choosingPhoto, setChoosingPhoto] = useState(true);
  const [profileAsset, setProfileAsset] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 300,
    aspect: 1,
  });

  const {
    replaceUserProperty,
    loading,
    error,
    setError,
    success,
    setSuccess,
  } = usePatchUser('5d9ac656-426b-40bf-a7a1-99ffe52f8786');

  const imageSrc = get(profileAsset, 'later-we-will-derive-asset-url', null);

  async function submitProfilePhoto() {
    const response = await replaceUserProperty('/profile_fileupload_guid', profileAsset);
    // submit data and wait for response...
    console.log(response);
    onClose();
  }

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
          <ProfileUploader
            onComplete={setProfileAsset}
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
            disabled={!profileAsset}
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
              onClick={submitProfilePhoto}
              autoFocus
              loading={loading}
            >
              <FormattedMessage id="SAVE" />
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
