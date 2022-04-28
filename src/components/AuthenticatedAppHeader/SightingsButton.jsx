import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import { formatDate } from '../../utils/formatters';
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
  const noResults = searchResults?.length === 0;
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
          {showDivider && <Divider />}
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
          <List dense style={{ maxHeight: 400, overflow: 'auto' }}>
            {mappableSearchResults.map(sighting => {
              const sightingGuid = sighting?.guid;

              const ownerName = get(
                sighting,
                ['owners', 0, 'full_name'],
                'Unknown User',
              );
              const regionLabel = sighting?.locationId_value;
              const createdDate = formatDate(sighting?.created, true);
              const sightingDate = formatDate(sighting?.time, true);
              // Fake text for now since not enough information is coming back
              const avatarLetter = ownerName[0].toUpperCase();

              return (
                <SearchResult
                  key={sightingGuid}
                  avatarLetter={avatarLetter}
                  href={`/sightings/${sightingGuid}`}
                  onClick={closePopover}
                  primaryText={
                    <FormattedMessage
                      values={{
                        region: regionLabel,
                        date: sightingDate,
                      }}
                      id="SIGHTING_SEARCH_RESULT_PRIMARY_TEXT"
                    />
                  }
                  secondaryText={
                    <FormattedMessage
                      values={{ name: ownerName, date: createdDate }}
                      id="SIGHTING_SEARCH_RESULT_SECONDARY_TEXT"
                    />
                  }
                />
              );
            })}
          </List>
        </>
      )}
    </SearchButton>
  );
}
