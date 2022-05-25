import React from 'react';

import TextEditor from '../fields/edit/TextEditor';
import InputRow from '../fields/edit/InputRow';

export default function PasswordResetCard({}) {
  return (
    <>
      <Text
        variant="caption"
        id={
          dialogData.isDefault
            ? 'DEFAULT_CATEGORY_NOT_EDITABLE'
            : 'CATEGORY_EDIT_MESSAGE'
        }
      />
      <InputRow schema={{ labelId: 'LABEL' }}>
        <TextEditor
          disabled={dialogData.isDefault}
          schema={{ labelId: 'LABEL' }}
          value={dialogData.label || ''}
          onChange={newLabel =>
            setDialogData({ ...dialogData, label: newLabel })
          }
        />
      </InputRow>
    </>
  );
}
