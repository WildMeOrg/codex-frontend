import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import {
  formatDate,
  formatSpecifiedTime,
} from '../../utils/formatters';
import useEncounterTermQuery from '../../models/encounter/useEncounterTermQuery';
import Text from '../Text';
import SearchButton from './SearchButton';
import SearchResult from './SearchResult';

export default function AnimalsButton() {
  const [inputContent, setInputContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: searchResults,
    loading,
    error,
  } = useEncounterTermQuery(searchTerm);

  const resultsCurrent = inputContent === searchTerm;
  const noResults = searchResults?.length === 0;
  const mappableSearchResults = resultsCurrent
    ? searchResults || []
    : [];
  const showDivider = resultsCurrent && (error || searchResults);

  return (
    <SearchButton
      loading={loading}
      buttonLabelId="ANIMALS"
      inputValue={inputContent}
      onChangeInputValue={setInputContent}
      onSearch={setSearchTerm}
      instructionsLabelId="SEARCH_ANIMALS_INSTRUCTION"
      linkLabelId="EXPLORE_ANIMALS"
      linkHref="/animals"
    >
      {closePopover => (
        <>
          {showDivider && <Divider />}
          {resultsCurrent && noResults && (
            <Text
              variant="body2"
              style={{ padding: '16px 0 0 48px' }}
              id="ENCOUNTER_SEARCH_NO_RESULTS"
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
            {mappableSearchResults.map(encounter => {
              const encounterGuid = encounter?.guid;
              const sightingGuid = encounter?.sighting_guid;
              const ownerName = get(
                encounter,
                ['owner', 'full_name'],
                'Unknown User',
              );
              const regionLabel = encounter?.locationId_value;
              const createdDate = formatDate(
                encounter?.created,
                true,
              );
              const encounterDate = formatSpecifiedTime(
                encounter?.time,
                encounter?.timeSpecificity,
              );
              const avatarLetter = ownerName[0].toUpperCase();

              return (
                <SearchResult
                  key={encounterGuid}
                  avatarLetter={avatarLetter}
                  href={`/sightings/${sightingGuid}`}
                  onClick={closePopover}
                  primaryText={
                    <FormattedMessage
                      values={{
                        region: regionLabel,
                        date: encounterDate,
                      }}
                      id="ANIMAL_SEARCH_RESULT_PRIMARY_TEXT"
                    />
                  }
                  secondaryText={
                    <FormattedMessage
                      values={{ name: ownerName, date: createdDate }}
                      id="ANIMAL_SEARCH_RESULT_SECONDARY_TEXT"
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
