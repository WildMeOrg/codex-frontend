import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircle';

import DataDisplay from '../../../../components/dataDisplays/DataDisplay';
import Button from '../../../../components/Button';
import useItisSearch from '../../../../utils/useItisSearch';

export default function SpeciesEditor({
  onClose,
  onSubmit,
  formSettings,
  setFormSettings,
  ...rest
}) {
  const intl = useIntl();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState(null);
  const { data: searchResults, loading, error } = useItisSearch(searchTerm);

  console.log(searchResults);

  const tableColumns = [
    {
      name: 'scientificName',
      label: intl.formatMessage({ id: 'SCIENTIFIC_NAME' }),
    },
    {
      name: 'commonNames',
      label: intl.formatMessage({ id: 'COMMON_NAMES' }),
      align: 'left',
      options: {
        customBodyRender: commonNames => commonNames.join(', ')
      },
    },
    {
      name: 'action',
      label: intl.formatMessage({ id: 'ADD' }),
      options: {
        customBodyRender: () => <IconButton><AddIcon /></IconButton>,
      },
    },
  ];

  const speciesOptions = get(formSettings, 'species', []);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle onClose={onClose}>
        <FormattedMessage id="EDIT_SPECIES" />
        <IconButton
          style={{ position: 'absolute', top: 8, right: 16 }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ minWidth: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField value={searchInput} onChange={e => setSearchInput(e.target.value)} label="Search species" variant="outlined" InputProps={{ startAdornment: <SearchIcon /> }} />
          <Button onClick={() => setSearchTerm(searchInput)} size="small" display="primary">Go</Button>
        </div>
        {searchResults && (
          <DataDisplay cellStyles={{ padding: '0 8px 0 12px' }} paperStyles={{ maxHeight: 360 }} style={{ marginTop: 12 }} noTitleBar variant="secondary" columns={tableColumns} data={searchResults} />
        )}
      </DialogContent>

      {/* <OptionEditor
        value={speciesOptions}
        onChange={newOptions => {
          setFormSettings({
            ...formSettings,
            species: newOptions,
          });
        }}
        {...rest}
      /> */}
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="primary" onClick={onSubmit}>
          <FormattedMessage id="FINISH" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
