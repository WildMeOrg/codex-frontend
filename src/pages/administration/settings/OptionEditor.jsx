import React from 'react';
import { FormattedMessage } from 'react-intl';
import { v4 as uuid } from 'uuid';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

import TextInput from '../../../components/inputs/TextInput';
import DeleteButton from '../../../components/DeleteButton';
import Button from '../../../components/Button';
import Text from '../../../components/Text';

export default function OptionEditor({
  open,
  onClose,
  onSubmit,
  schema,
  value,
  onChange,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  children,
  ...rest
}) {
  const options = value || [];
  const displayedOptions =
    options.length > 0 ? options : [{ label: '', value: '', id: 6 }];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage id={schema.labelId || 'OPTION_EDITOR'} />
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
          <Text
            style={{ marginBottom: 20 }}
            id={schema.descriptionId}
          />
        )}
        {displayedOptions.map((option, optionIndex) => {
          const otherOptions = options.filter(
            o => o.id !== option.id,
          );
          const showDeleteButton = displayedOptions.length !== 1;
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 12,
              }}
              key={option.id}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text variant="subtitle2" id="OPTION" />
                {showDeleteButton && (
                  <DeleteButton
                    onClick={() => onChange(otherOptions)}
                  />
                )}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'flex-end' }}
                {...rest}
              >
                <FormControl style={{ marginRight: 12 }}>
                  <TextInput
                    onChange={label => {
                      const newOptions = [...options];
                      newOptions[optionIndex] = {
                        ...option,
                        label,
                      };
                      onChange(newOptions);
                    }}
                    width={200}
                    schema={{ labelId: 'OPTION_LABEL' }}
                    value={option.label}
                  />
                </FormControl>
                <FormControl style={{ marginLeft: 12 }}>
                  <TextInput
                    onChange={newValue => {
                      const newOptions = [...options];
                      newOptions[optionIndex] = {
                        ...option,
                        value: newValue,
                      };
                      onChange(newOptions);
                    }}
                    width={200}
                    schema={{ labelId: 'OPTION_VALUE' }}
                    value={option.value}
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
              options.length > 0 ? 'ADD_ANOTHER_OPTION' : 'ADD_OPTION'
            }
          />
        </Button>
        {children}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="primary" onClick={onSubmit}>
          <FormattedMessage id="FINISH" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
