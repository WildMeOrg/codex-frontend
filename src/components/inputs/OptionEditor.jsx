import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import TextInput from './TextInput';
import DeleteButton from '../DeleteButton';
import Button from '../Button';

export default function OptionEditor({
  schema,
  value: options,
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
            id="X_OPTIONS"
            values={{ x: options.length }}
          />
        </Button>
      </div>
      <Dialog open={modalOpen} onClose={onClose}>
        <DialogTitle onClose={onClose}>
          <FormattedMessage id="OPTION_EDITOR" />
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
          {options.map(option => {
            const otherOptions = options.filter(
              o => o.value !== option.value,
            );

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 12,
                }}
                key={option.id}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Typography variant="subtitle2">
                    <FormattedMessage id="OPTION" />
                  </Typography>
                  <DeleteButton
                    onClick={() => onChange(otherOptions)}
                  />
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'flex-end' }}
                  {...rest}
                >
                  <FormControl style={{ marginRight: 12 }}>
                    <TextInput
                      onChange={value => {
                        onChange([
                          ...otherOptions,
                          { ...option, value },
                        ]);
                      }}
                      schema={{ labelId: 'OPTION_VALUE' }}
                      value={option.value}
                    />
                  </FormControl>
                  <FormControl style={{ marginLeft: 12 }}>
                    <TextInput
                      onChange={label => {
                        onChange([
                          ...otherOptions,
                          { ...option, label },
                        ]);
                      }}
                      schema={{ labelId: 'OPTION_LABEL' }}
                      value={option.label}
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
                ...options,
                {
                  label: '',
                  value: '',
                  id: uuid(),
                },
              ]);
            }}
            size="small"
          >
            <FormattedMessage
              id={
                options.length > 0
                  ? 'ADD_ANOTHER_OPTION'
                  : 'ADD_OPTION'
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
