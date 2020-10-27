import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../components/Button';
import OptionEditor from './OptionEditor';

export default function OptionEditorButton({ value, ...rest }) {
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = () => setModalOpen(false);

  const options = value || [];
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
        >
          <FormattedMessage
            id="X_OPTIONS"
            values={{ x: options.length }}
          />
        </Button>
      </div>
      <OptionEditor
        open={modalOpen}
        onClose={onClose}
        onSubmit={onClose}
        value={value}
        {...rest}
      />
    </div>
  );
}
