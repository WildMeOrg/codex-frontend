import React, { useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';

import CustomAlert from '../../components/Alert';

import { getKeywordColor } from '../../utils/colorUtils';
import StandardDialog from '../../components/StandardDialog';
import Button from '../../components/Button';
import useKeywords from '../../models/keyword/useKeywords';
import useAddKeyword from '../../models/keyword/useAddKeyword';
import Keywords from './Keywords';
import MorePhotoMenu from './MorePhotoMenu';

export default function AnnotationDetail({
  annotation,
  open,
  onClose,
  refreshSightingData,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addingTag, setAddingTag] = useState(false);

  const { keywords: keywordOptions } = useKeywords();

  /* Feels weird but it's what material wants: https://material-ui.com/components/autocomplete/#controllable-states */
  const [newTagSelectValue, setNewTagSelectValue] = useState(null);
  const [newTagInputValue, setNewTagInputValue] = useState('');

  const {
    addKeyword,
    loading: addKeywordLoading,
    error: addKeywordError,
    setError: setAddKeywordError,
  } = useAddKeyword();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCloseDialog = () => {
    onClose();
    setAddingTag(false);
    setNewTagInputValue('');
    setNewTagSelectValue(null);
  };

  return (
    <StandardDialog fullScreen open={open} onClose={onCloseDialog}>
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
          <CustomAlert
            style={{ marginTop: 16, marginBottom: 8 }}
            severity="error"
            onClose={() => setAddKeywordError(null)}
            titleId="SERVER_ERROR"
            description={addKeywordError}
          />
        )}
        <Keywords
          annotation={annotation}
          deletable
          refreshSightingData={refreshSightingData}
        >
          {addingTag ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Autocomplete
                id="tag value"
                freeSolo
                blurOnSelect
                clearOnEscape
                handleHomeEndKeys
                selectOnFocus
                value={newTagSelectValue}
                onChange={(_, newValue) => {
                  setNewTagSelectValue(newValue);
                }}
                inputValue={newTagInputValue}
                onInputChange={(_, newValue) => {
                  setNewTagInputValue(newValue);
                }}
                disabled={addKeywordLoading}
                options={keywordOptions || []}
                getOptionLabel={option => get(option, 'value', '')}
                renderOption={option => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        marginRight: 8,
                        borderRadius: 100,
                        backgroundColor: getKeywordColor(option.guid),
                      }}
                    />
                    <span>{option.value}</span>
                  </div>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    autoFocus
                    style={{ width: 200, margin: '0 8px' }}
                  />
                )}
              />
              <Button
                display="panel"
                size="small"
                loading={addKeywordLoading}
                onClick={async () => {
                  const selectValue = get(newTagSelectValue, 'value');
                  const selectKeywordId = get(
                    newTagSelectValue,
                    'guid',
                  );
                  const matchingKeywordId =
                    newTagInputValue === selectValue
                      ? selectKeywordId
                      : null;

                  const successful = await addKeyword(
                    get(annotation, 'guid'),
                    matchingKeywordId,
                    newTagInputValue,
                  );
                  if (successful) {
                    setNewTagInputValue('');
                    setNewTagSelectValue(null);
                    refreshSightingData();
                  }
                }}
                id="ADD_TAG"
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
