import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import LocationIdEditor from '../../../components/fields/edit/LocationIdEditor';
import SelectionEditor from '../../../components/fields/edit/SelectionEditor';
import fieldTypes from '../../../constants/fieldTypesNew';
import CustomAlert from '../../../components/Alert';
import RadioChoice from '../../../components/RadioChoice';
import InputRow from '../../../components/fields/edit/InputRow';
import Button from '../../../components/Button';
import StandardDialog from '../../../components/StandardDialog';
import Text from '../../../components/Text';

const jobModes = {
  default: 'default',
  custom: 'custom',
  none: 'none',
};

const algorithmSchema = {
  labelId: 'ALGORITHMS',
  descriptionId: 'ALGORITHMS_DESCRIPTION',
  fieldType: fieldTypes.multiselect,
  required: true,
  choices: [
    {
      label: 'Hotspotter',
      value: 'hotspotter_nosv',
    },
    {
      label: 'Groth bitch',
      value: 'whynot',
    },
  ],
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

export default function MatchingSetDialog({
  open,
  onClose,
  titleId,
}) {
  const intl = useIntl();

  const [mode, setMode] = useState(jobModes.custom);
  // const [mode, setMode] = useState(jobModes.default);
  const [region, setRegion] = useState('');
  const [algorithms, setAlgorithms] = useState([]);

  return (
    <StandardDialog
      PaperProps={{ style: { width: 800 } }}
      maxWidth="lg"
      open={open}
      onClose={onClose}
      titleId={titleId}
    >
      <DialogContent style={{ minWidth: 200 }}>
        <RadioChoice
          titleId="IDENTIFICATION_SETTINGS"
          value={mode}
          onChange={setMode}
          choices={jobModeChoices}
        />
        {mode === jobModes.custom && (
          <>
            <InputRow schema={algorithmSchema}>
              <SelectionEditor
                schema={algorithmSchema}
                minimalLabels
                value={algorithms}
                onChange={setAlgorithms}
              />
            </InputRow>
          </>
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
          id="SAVE"
        />
      </DialogActions>
    </StandardDialog>
  );
}
