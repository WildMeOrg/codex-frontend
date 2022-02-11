import React, { useState } from 'react';
import { get, capitalize } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';

import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import useQueryIndividuals from '../models/individual/useQueryIndividuals';
import DataDisplay from './dataDisplays/DataDisplay';
import Button from './Button';
import Text from './Text';
import CustomAlert from './Alert';
import { cellRendererTypes } from '../components/dataDisplays/cellRenderers';

export default function IndividualSelector({
  setSelectedIndividualId,
  width = 520,
}) {
  const intl = useIntl();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState(null);
  const {
    data: searchResults,
    searchTerm: lastSearchTerm,
    loading: searchResultsLoading,
    error: searchResultsError,
    queryIndividuals,
  } = useQueryIndividuals(searchTerm);

  const resultsCurrent = lastSearchTerm === searchTerm;
  const noResults = searchResults && searchResults.length === 0;
  const canShowTable =
    searchTerm && !searchResultsError && !noResults;

  const tableColumns = [
    {
      name: 'name',
      label: intl.formatMessage({
        id: 'NAME',
      }),
    },
    {
      name: 'alias',
      label: intl.formatMessage({
        id: 'ALIAS',
      }),
      align: 'left',
      options: { cellRenderer: cellRendererTypes.capitalizedString },
    },
    {
      name: 'speciesString',
      label: intl.formatMessage({ id: 'SPECIES' }),
      align: 'left',
      options: {
        customBodyRender: (_, individual) => {
          const genusString = capitalize(
            get(individual, 'genus', ''),
          );
          const speciesString = `${genusString} ${get(
            individual,
            'species',
            '',
          )}`;
          return <Text variant="body2">{speciesString}</Text>;
        },
      },
    },
  ];

  return (
    <div style={{ width }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (searchInput !== lastSearchTerm) {
            setSearchTerm(searchInput);
            queryIndividuals(searchInput);
          }
        }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <TextField
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          label={intl.formatMessage({
            id: 'SEARCH_INDIVIDUALS_INSTRUCTION',
          })}
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
        <CustomAlert
          style={{ marginTop: 16, width }}
          severity="warning"
        >
          {searchResultsError}
        </CustomAlert>
      )}
      {resultsCurrent && noResults && (
        <Text
          variant="body2"
          style={{ paddingTop: 16 }}
          id="INDIVIDUAL_SEARCH_NO_RESULTS"
          values={{ searchTerm }}
        />
      )}
      {canShowTable && (
        <DataDisplay
          paperStyles={{ maxHeight: 360 }}
          style={{ marginTop: 12 }}
          noTitleBar
          variant="secondary"
          columns={tableColumns}
          data={searchResults || []}
          onSelectRow={selectedIndividual => {
            setSelectedIndividualId(get(selectedIndividual, 'id'));
          }}
        />
      )}
    </div>
  );
}
