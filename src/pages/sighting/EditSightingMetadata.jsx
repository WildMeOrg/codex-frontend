import React from 'react';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import DefaultRenderer from '../../components/renderers/DefaultRenderer';
import InputRow from '../../components/InputRow';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';

export default function EditSightingMetadata({
  open,
  metadata,
  onClose,
  onSubmit,
  error,
}) {
  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId="EDIT_SIGHTING_METADATA"
    >
      <DialogContent style={{ minWidth: 200 }}>
        {metadata &&
          metadata.map(field => {
            if (!field.value) return null;
            if (!field.editor) {
              const Renderer = field.renderer || DefaultRenderer;
              return (
                <InputRow labelId={field.titleId} key={field.id}>
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
    </StandardDialog>
  );
}
