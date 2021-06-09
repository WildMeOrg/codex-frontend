import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import FormControl from '@material-ui/core/FormControl';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import TextInput from '../../../components/inputs/TextInput';
import DeleteButton from '../../../components/DeleteButton';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import StandardDialog from '../../../components/StandardDialog';

export default function FileTypeEditor({
  schema,
  value: filetypes,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = () => setModalOpen(false);

  const displayedFileTypes = filetypes.length > 0 ? filetypes : [''];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Button
          size="small"
          style={{ marginTop: 16 }}
          onClick={() => setModalOpen(true)}
          {...rest}
        >
          <FormattedMessage
            id="X_FILETYPES"
            values={{ x: filetypes.length }}
          />
        </Button>
      </div>
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="ALLOWED_FILETYPES_EDITOR"
      >
        <DialogContent style={{ minWidth: 200 }}>
          {schema.descriptionId && (
            <Text
              style={{ marginBottom: 20 }}
              id={schema.descriptionId}
            />
          )}
          {displayedFileTypes.map((filetype, index) => {
            const showDeleteButton = displayedFileTypes.length !== 1;

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 12,
                }}
                key={index}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Text variant="subtitle2" id="FILETYPE" />
                  {showDeleteButton && (
                    <DeleteButton
                      onClick={() => {
                        onChange(
                          filetypes.filter((f, i) => i !== index),
                        );
                      }}
                    />
                  )}
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'flex-end' }}
                  {...rest}
                >
                  <FormControl style={{ marginRight: 12 }}>
                    <TextInput
                      onChange={value => {
                        const newFiletypes = [...filetypes];
                        newFiletypes[index] = value;
                        onChange(newFiletypes);
                      }}
                      schema={{ labelId: 'FILETYPE' }}
                      value={filetype}
                    />
                  </FormControl>
                </div>
              </div>
            );
          })}
          <Button
            style={{ marginTop: 16 }}
            onClick={() => {
              onChange([...filetypes, '']);
            }}
            size="small"
          >
            <FormattedMessage
              id={
                filetypes.length > 0
                  ? 'ADD_ANOTHER_FILETYPE'
                  : 'ADD_FILETYPE'
              }
            />
          </Button>
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button
            display="primary"
            onClick={() => {
              onClose();
            }}
          >
            <FormattedMessage id="FINISH" />
          </Button>
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
