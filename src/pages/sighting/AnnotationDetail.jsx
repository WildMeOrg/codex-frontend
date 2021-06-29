import React, { useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';

import StandardDialog from '../../components/StandardDialog';
import Button from '../../components/Button';
import useAddKeyword from '../../models/keyword/useAddKeyword';
import Keywords from './Keywords';
import MorePhotoMenu from './MorePhotoMenu';

export default function AnnotationDetail({
  annotation,
  open,
  onClose,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  const {
    addKeyword,
    loading: addKeywordLoading,
    error: addKeywordError,
    setError: setAddKeywordError,
  } = useAddKeyword();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StandardDialog fullScreen open={open} onClose={onClose}>
      <MorePhotoMenu
        id="detail-image-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      />
      <div
        style={{
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'relative', alignSelf: 'start' }}>
          <img
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
            src={get(annotation, 'src')}
            alt={get(annotation, 'filename')}
          />
        </div>
        {addKeywordError && (
          <Alert
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
            onClose={() => setAddKeywordError(null)}
          >
            <AlertTitle>
              <FormattedMessage id="SERVER_ERROR" />
            </AlertTitle>
            {addKeywordError}
          </Alert>
        )}
        <Keywords annotation={annotation}>
          {addingTag ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Autocomplete
                id="tag value"
                freeSolo
                disabled={addKeywordLoading}
                options={[{ label: 'hey' }]}
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField
                    {...params}
                    onChange={e => setNewTagValue(e.target.value)}
                    style={{ width: 200, marginRight: 8 }}
                  />
                )}
              />
              <Button
                display="panel"
                size="small"
                loading={addKeywordLoading}
                onClick={async () => {
                  const result = await addKeyword(
                    get(annotation, 'guid'),
                    null,
                    newTagValue,
                  );
                  console.log(result);
                }}
                id="ADD"
              />
            </div>
          ) : (
            <Button
              display="basic"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAddingTag(true)}
              id="ADD_TAG"
            />
          )}
        </Keywords>
      </div>
    </StandardDialog>
  );
}
