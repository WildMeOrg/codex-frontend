import React, { useState } from 'react';
import { get } from 'lodash-es';
import { useIntl } from 'react-intl';

import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import useIndividualTermQuery from '../models/individual/useIndividualTermQuery';
import DataDisplay from './dataDisplays/DataDisplay';
import Button from './Button';
import Text from './Text';
import CustomAlert from './Alert';
import { cellRendererTypes } from '../components/dataDisplays/cellRenderers';
import { deriveIndividualName } from '../utils/nameUtils';

export default function IndividualSelector({
  setSelectedIndividualId,
  width = 520,
}) {
  const intl = useIntl();

  const [inputContent, setInputContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: searchResults,
    loading: searchResultsLoading,
    error: searchResultsError,
  } = useIndividualTermQuery(searchTerm);

  const resultsCurrent = inputContent === searchTerm;
  const noResults = searchResults && searchResults.length === 0;
  const canShowTable =
    searchTerm && !searchResultsError && !noResults;

  const tableColumns = [
    {
      name: 'name',
      labelId: 'NAME',
      options: {
        customBodyRender: (_, individual) =>
        {
          const name = deriveIndividualName(individual, 'FirstName', 'Unnamed Individual');
          return <Text variant="body2">{name}</Text>
        }
      },
    },
    {
      name: 'adoptionName',
      labelId: 'ADOPTION_NAME',
      align: 'left',
      options: {
        customBodyRender: (_, individual) =>
        {
          const adoptionName = deriveIndividualName(individual, 'AdoptionName', '-');
          return <Text variant="body2">{adoptionName}</Text>
        }
      },
    },
    {
      name: 'created',
      labelId: 'CREATED',
      align: 'left',
      options: {
        cellRenderer: cellRendererTypes.date,
      },
    },
  ];

  return (
    <div style={{ width }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (searchTerm !== inputContent)
          {
            setSearchTerm(searchTerm);
          }
        }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <TextField
          value={inputContent}
          onChange={e => setInputContent(e.target.value)}
          label={intl.formatMessage({
            id: 'SEARCH_INDIVIDUALS_INSTRUCTION',
          })}
          variant="outlined"
          InputProps={{ startAdornment: <SearchIcon /> }}
          style={{ width: '100%' }}
        />
        <Button
          onClick={() =>
          {
            if (inputContent !== '') setSearchTerm(inputContent);
          }}
          display="primary"
          loading={searchResultsLoading}
          style={{ marginLeft: 12 }}
          type="submit"
          id="SEARCH"
        />
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
          idKey="guid"
          paperStyles={{ maxHeight: 360 }}
          style={{ marginTop: 12 }}
          noTitleBar
          variant="secondary"
          columns={tableColumns}
          data={searchResults || []}
          onSelectRow={selectedIndividual => {
            setSelectedIndividualId(get(selectedIndividual, 'guid'));
          }}
        />
      )}
    </div>
  );
}
