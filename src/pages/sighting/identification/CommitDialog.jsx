import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import CustomAlert from '../../../components/Alert';
import RadioChoice from '../../../components/RadioChoice';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';
import useSightingFieldSchemas from '../../../models/sighting/useSightingFieldSchemas';
import CustomMatchingSetForm from './CustomMatchingSetForm';

const jobModes = {
  default: 'default',
  custom: 'custom',
  none: 'none',
};

const jobModeChoices = [
  {
    labelId: 'IDENTIFICATION_MODE_DEFAULT_SETTINGS',
    value: jobModes.default,
  },
  {
    labelId: 'IDENTIFICATION_MODE_CUSTOM_SETTINGS',
    value: jobModes.custom,
  },
  {
    labelId: 'IDENTIFICATION_MODE_NO_ID',
    value: jobModes.none,
  },
];

export default function CommitDialog({ open, onClose }) {
  const intl = useIntl();

  const [idConfig, setIdConfig] = useState(null);

  const sightingFieldSchemas = useSightingFieldSchemas();

  const [mode, setMode] = useState(jobModes.custom);
  // const [mode, setMode] = useState(jobModes.default);

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="xl"
      open={open}
      onClose={onClose}
      titleId="COMMIT_SIGHTING"
    >
      <DialogContent style={{ minWidth: 200 }}>
        <RadioChoice
          titleId="IDENTIFICATION_SETTINGS"
          value={mode}
          onChange={setMode}
          choices={jobModeChoices}
        />
        {mode === jobModes.custom && (
          <CustomMatchingSetForm
            idConfig={idConfig}
            setIdConfig={setIdConfig}
          />
        )}
        {false && (
          <CustomAlert severity="error" titleId="SUBMISSION_ERROR">
            <Text variant="body2">There was an error</Text>
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button
          display="basic"
          onClick={() => {
            onClose();
          }}
          id="CANCEL"
        />
        <Button
          loading={false}
          display="primary"
          onClick={Function.prototype}
          id="COMMIT_SIGHTING"
        />
      </DialogActions>
    </StandardDialog>
  );
}
