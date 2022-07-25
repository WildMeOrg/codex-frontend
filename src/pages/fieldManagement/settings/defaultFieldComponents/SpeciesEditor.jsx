import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircle';
import CheckIcon from '@material-ui/icons/Check';
import StarIcon from '@material-ui/icons/Star';
import CustomAlert from '../../../../components/Alert';

import useItisSearch from '../../../../utils/useItisSearch';
import DataDisplay from '../../../../components/dataDisplays/DataDisplay';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import StandardDialog from '../../../../components/StandardDialog';

export default function SpeciesEditor({
  onClose,
  onSubmit,
  formSettings,
  siteSettings,
  setFormSettings,
}) {
  const intl = useIntl();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState(null);
  const {
    data: searchResults,
    loading: searchResultsLoading,
    error: searchResultsError,
  } = useItisSearch(searchTerm);

  const currentSpecies = get(formSettings, 'species', []);
  const suggestedValues = get(
    siteSettings,
    ['site.species', 'suggestedValues'],
    [],
  );

  const tableColumns = [
    {
      name: 'scientificName',
      label: intl.formatMessage({ id: 'SCIENTIFIC_NAME' }),
      options: {
        customBodyRender: (scientificName, species) => {
          const suggested = suggestedValues.find(
            suggestedValue =>
              suggestedValue.itisTsn === species.itisTsn,
          );

          return (
            <Text
              variant="body2"
              style={{
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {suggested && <StarIcon style={{ marginRight: 4 }} />}
              {scientificName}
            </Text>
          );
        },
      },
    },
    {
      name: 'commonNames',
      label: intl.formatMessage({ id: 'COMMON_NAMES' }),
      align: 'left',
      options: {
        customBodyRender: commonNames => commonNames.join(', '),
      },
    },
    {
      name: 'action',
      label: intl.formatMessage({ id: 'ADD' }),
      options: {
        customBodyRender: (_, species) => {
          if (
            currentSpecies.find(s => s.itisTsn === species.itisTsn)
          ) {
            return (
              <div style={{ padding: 12 }}>
                <CheckIcon />
              </div>
            );
          }
          return (
            <IconButton
              onClick={() =>
                setFormSettings({
                  ...formSettings,
                  species: [...currentSpecies, species],
                })
              }
            >
              <AddIcon />
            </IconButton>
          );
        },
      },
    },
  ];

  return (
    <StandardDialog open onClose={onClose} titleId="EDIT_SPECIES">
      <DialogContent style={{ minWidth: 200 }}>
        <div style={{ marginBottom: 24 }}>
          {currentSpecies.map(s => (
            <Tooltip
              key={s.itisTsn}
              title={get(s, 'commonNames', []).join(', ')}
            >
              <Chip
                style={{ marginRight: 4, marginBottom: 8 }}
                label={s.scientificName}
                onDelete={() => {
                  const newSpecies = currentSpecies.filter(
                    c => c.itisTsn !== s.itisTsn,
                  );

                  setFormSettings({
                    ...formSettings,
                    species: newSpecies,
                  });
                }}
              />
            </Tooltip>
          ))}
        </div>
        <form
          onSubmit={e => {
            setSearchTerm(searchInput);
            e.preventDefault();
          }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <TextField
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            label={intl.formatMessage({ id: 'SEARCH_ITIS_SPECIES' })}
            variant="outlined"
            InputProps={{ startAdornment: <SearchIcon /> }}
            style={{ width: '100%' }}
          />
          <Button
            onClick={() => setSearchTerm(searchInput)}
            display="primary"
            loading={searchResultsLoading}
            style={{ marginLeft: 12 }}
            type="submit"
          >
            <FormattedMessage id="SEARCH" />
          </Button>
        </form>
        {searchResultsError && (
          <CustomAlert severity="error">
            {searchResultsError}
          </CustomAlert>
        )}
        <DataDisplay
          cellStyles={{ padding: '0 8px 0 12px' }}
          style={{ marginTop: 12 }}
          noTitleBar
          variant="secondary"
          columns={tableColumns}
          data={searchResults || suggestedValues}
          idKey="itisTsn"
          tableContainerStyles={{ maxHeight: 300 }}
        />
        <Text
          component="p"
          variant="caption"
          style={{ margin: '8px 4px' }}
          id="STAR_EXPLANATION"
        />
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="primary" onClick={onSubmit}>
          <FormattedMessage id="FINISH" />
        </Button>
      </DialogActions>
    </StandardDialog>
  );
}
