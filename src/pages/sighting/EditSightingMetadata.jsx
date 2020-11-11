import React from 'react';
import { FormattedMessage } from 'react-intl';

import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import DefaultRenderer from '../../components/renderers/DefaultRenderer';
import InputRow from '../../components/InputRow';
import Button from '../../components/Button';

export default function EditSightingMetadata({
  open,
  metadata,
  onClose,
  onSubmit,
  error,
}) {
  console.log(metadata);
  return (
    <Dialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
    >
      <DialogTitle onClose={onClose}>
        <FormattedMessage id="EDIT_SIGHTING_METADATA" />
        <IconButton
          style={{ position: 'absolute', top: 8, right: 16 }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ minWidth: 200 }}>
        {metadata &&
          metadata.map(field => {
            if (!field.value) return null;
            if (!field.editor) {
              const Renderer = field.renderer || DefaultRenderer;
              return (
                <InputRow labelId={field.labelId} key={field.id}>
                  <Renderer value={field.value} />
                </InputRow>
              );
            }
            return (
              <InputRow
                labelId={field.labelId}
                descriptionId={field.descriptionId}
                key={field.id}
              >
                <field.editor
                  schema={{
                    fieldType: 'float',
                    labelId: field.labelId,
                    descriptionId: field.descriptionId,
                  }}
                  value={field.value}
                  onChange={() => {}}
                />
              </InputRow>
            );
          })}
        {error && (
          <Alert severity="error">
            <AlertTitle>
              <FormattedMessage id="SUBMISSION_ERROR" />
            </AlertTitle>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button display="primary" onClick={onSubmit}>
          <FormattedMessage id="SAVE" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
