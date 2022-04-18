import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import usePatchAGS from '../../../models/assetGroupSighting/usePatchAGS';
import useCommitAssetGroupSighting from '../../../models/assetGroupSighting/useCommitAssetGroupSighting';
import CustomAlert from '../../../components/Alert';
import RadioChoice from '../../../components/RadioChoice';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';
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
    labelId: 'IDENTIFICATION_MODE_NO_ID',
    value: jobModes.none,
  },
  {
    labelId: 'IDENTIFICATION_MODE_CUSTOM_SETTINGS',
    value: jobModes.custom,
  },
];

export default function CommitDialog({ agsGuid, open, onClose }) {
  const [idConfig, setIdConfig] = useState(null);
  const [mode, setMode] = useState(jobModes.default);

  const {
    mutate: patchAgs,
    loading: patchAgsLoading,
    error: patchAgsError,
    clearError: clearPatchAgsError,
  } = usePatchAGS();

  const {
    mutate: commitAgs,
    loading: commitAgsLoading,
    error: commitAgsError,
    clearError: clearCommitAgsError,
  } = useCommitAssetGroupSighting();

  const error = patchAgsError || commitAgsError;

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
          onChange={newMode => {
            setMode(newMode);
            if (patchAgsError) clearPatchAgsError();
            if (commitAgsError) clearCommitAgsError();
          }}
          choices={jobModeChoices}
        />
        {mode === jobModes.custom && (
          <CustomMatchingSetForm
            idConfig={idConfig}
            setIdConfig={setIdConfig}
          />
        )}
        {error && (
          <CustomAlert severity="error" titleId="SERVER_ERROR">
            <Text variant="body2">{error}</Text>
          </CustomAlert>
        )}
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose} id="CANCEL" />
        <Button
          loading={patchAgsLoading || commitAgsLoading}
          display="primary"
          onClick={async () => {
            let idConfigPatchValue = [idConfig];
            if (mode === jobModes.default) {
              idConfigPatchValue = [
                {
                  algorithms: ['hotspotter_nosv'],
                  matching_set: null,
                },
              ];
            } else if (mode === jobModes.none) {
              idConfigPatchValue = [];
            }

            const idConfigPatchResult = await patchAgs({
              agsGuid,
              data: [
                {
                  op: 'replace',
                  path: '/idConfigs',
                  value: idConfigPatchValue,
                },
              ],
            });

            const resultIsSuccessful =
              idConfigPatchResult?.status === 200;
            if (resultIsSuccessful) {
              await commitAgs({ agsGuid });
            }
          }}
          id="COMMIT_SIGHTING"
        />
      </DialogActions>
    </StandardDialog>
  );
}
