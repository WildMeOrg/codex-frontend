import React, { useState } from 'react';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import { deriveIndividualName } from '../../utils/nameUtils';
import { formatDate } from '../../utils/formatters';
import useIndividualTermQuery from '../../models/individual/useIndividualTermQuery';
import Text from '../Text';
import SearchButton from './SearchButton';
import SearchResult from './SearchResult';

export default function SightingsButton() {
  const [inputContent, setInputContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: searchResults,
    loading,
    error,
  } = useIndividualTermQuery(searchTerm);

  const resultsCurrent = inputContent === searchTerm;
  const noResults = searchResults && searchResults.length === 0;
  const mappableSearchResults = resultsCurrent
    ? searchResults || []
    : [];
  const showDivider = resultsCurrent && (error || searchResults);

  return (
    <SearchButton
      loading={loading}
      buttonLabelId="SIGHTINGS"
      inputValue={inputContent}
      onChangeInputValue={setInputContent}
      onSearch={setSearchTerm}
      instructionsLabelId="SEARCH_SIGHTINGS_INSTRUCTION"
      linkLabelId="EXPLORE_SIGHTINGS"
      linkHref="/sightings"
    >
      {closePopover => (
        <>
          {showDivider ? <Divider /> : null}
          {resultsCurrent && noResults && (
            <Text
              variant="body2"
              style={{ padding: '16px 0 0 48px' }}
              id="INDIVIDUAL_SEARCH_NO_RESULTS"
              values={{ searchTerm }}
            />
          )}
          {resultsCurrent && error && (
            <Text
              id="SEARCH_SERVER_ERROR"
              variant="body2"
              style={{ padding: '16px 0 0 48px' }}
            />
          )}
          <List dense style={{ maxHeight: 400, overflow: 'scroll' }}>
            {mappableSearchResults.map(individual => {
              const individualGuid = individual?.guid;
              const adoptionName = deriveIndividualName(
                individual,
                'AdoptionName',
              );
              const defaultName = deriveIndividualName(
                individual,
                'FirstName',
                'Unnamed Individual',
              );
              const displayString = adoptionName
                ? `${defaultName} (${adoptionName})`
                : defaultName;
              const avatarLetter = defaultName[0].toUpperCase();
              const createdDate = formatDate(
                individual?.created,
                true,
                'Unknown date',
              );

              return (
                <SearchResult
                  key={individualGuid}
                  avatarLetter={avatarLetter}
                  href={`/individuals/${individualGuid}`}
                  onClick={closePopover}
                  primaryText={displayString}
                  secondaryText={`Created on ${createdDate}`}
                />
              );
            })}
          </List>
        </>
      )}
    </SearchButton>
  );
}
