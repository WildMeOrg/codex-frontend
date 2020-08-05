import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import TextInput from '../TextInput';
import DeleteButton from '../../DeleteButton';
import Button from '../../Button';

export default function FileTypeEditor({
  schema,
  value: filetypes,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  ...rest
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = () => setModalOpen(false);

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
        <Typography>
          <FormattedMessage id={schema.labelId} />
        </Typography>
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
      <Dialog open={modalOpen} onClose={onClose}>
        <DialogTitle onClose={onClose}>
          <FormattedMessage id="ALLOWED_FILETYPES_EDITOR" />
          <IconButton
            style={{ position: 'absolute', top: 8, right: 16 }}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ minWidth: 200 }}>
          {schema.descriptionId && (
            <Typography style={{ marginBottom: 20 }}>
              <FormattedMessage id={schema.descriptionId} />
            </Typography>
          )}
          {filetypes.map((filetype, index) => {
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
                  <Typography variant="subtitle2">
                    <FormattedMessage id="FILETYPE" />
                  </Typography>
                  <DeleteButton
                    onClick={() => onChange(filetypes.splice(index, 1))}
                  />
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
              onChange([
                ...filetypes,
                '',
              ]);
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
        <DialogActions>
          <Button
            display="basic"
            onClick={() => {
              onClose();
            }}
          >
            <FormattedMessage id="FINISH" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
