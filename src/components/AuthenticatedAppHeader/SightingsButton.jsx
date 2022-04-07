import React, { useState } from 'react';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import useSightingTermQuery from '../../models/sighting/useSightingTermQuery';
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
  } = useSightingTermQuery(searchTerm);

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
              id="SIGHTING_SEARCH_NO_RESULTS"
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
            {mappableSearchResults.map(sighting => {
              const sightingGuid = sighting?.guid;

              // Fake text for now since not enough information is coming back
              const displayString = sightingGuid;
              const avatarLetter = displayString[0].toUpperCase();

              return (
                <SearchResult
                  key={sightingGuid}
                  avatarLetter={avatarLetter}
                  href={`/sightings/${sightingGuid}`}
                  onClick={closePopover}
                  primaryText={displayString}
                  secondaryText="Created on May 4, 2002"
                />
              );
            })}
          </List>
        </>
      )}
    </SearchButton>
  );
}
