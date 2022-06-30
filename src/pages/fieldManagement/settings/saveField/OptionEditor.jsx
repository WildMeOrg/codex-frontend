import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import TextInput from '../../../../components/inputs/TextInput';
import DeleteButton from '../../../../components/DeleteButton';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import StandardDialog from '../../../../components/StandardDialog';

export default function OptionEditor({
  open,
  onClose,
  onSubmit,
  value,
  onChange,
  ...rest
}) {
  const options = value || [];
  const displayedOptions =
    options.length > 0 ? options : [{ label: '', value: '' }];

  return (
    <StandardDialog
      open={open}
      onClose={onClose}
      titleId="OPTION_EDITOR"
    >
      <DialogContent style={{ minWidth: 200 }}>
        {displayedOptions.map((option, optionIndex) => {
          const otherOptions = options.filter(
            o => o.value !== option.value,
          );
          const showDeleteButton = displayedOptions.length !== 1;
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 12,
              }}
              key={option.value}
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
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="primary" onClick={onSubmit}>
          <FormattedMessage id="FINISH" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
