import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import { deriveIndividualName } from '../../utils/nameUtils';
import { formatDate } from '../../utils/formatters';
import useIndividualTermQuery from '../../models/individual/useIndividualTermQuery';
import Text from '../Text';
import SearchButton from './SearchButton';
import SearchResult from './SearchResult';

export default function IndividualsButton() {
  const intl = useIntl();

  const [inputContent, setInputContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: searchResults,
    loading,
    error,
  } = useIndividualTermQuery(searchTerm);

  const resultsCurrent = inputContent === searchTerm;
  const noResults = searchResults?.length === 0;
  const mappableSearchResults = resultsCurrent
    ? searchResults || []
    : [];
  const showDivider = resultsCurrent && (error || searchResults);

  return (
    <SearchButton
      loading={loading}
      buttonLabelId="INDIVIDUALS"
      inputValue={inputContent}
      onChangeInputValue={setInputContent}
      onSearch={setSearchTerm}
      instructionsLabelId="SEARCH_INDIVIDUALS_INSTRUCTION"
      linkLabelId="EXPLORE_INDIVIDUALS"
      linkHref="/individuals"
    >
      {closePopover => (
        <>
          {showDivider && <Divider />}
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
          <List dense style={{ maxHeight: 400, overflow: 'auto' }}>
            {mappableSearchResults.map(individual => {
              const individualGuid = individual?.guid;
              const adoptionName = deriveIndividualName(
                individual,
                'AdoptionName',
              );
              const defaultName = deriveIndividualName(
                individual,
                'FirstName',
                intl.formatMessage({ id: 'UNNAMED_INDIVIDUAL' }),
              );
              const displayString = adoptionName
                ? `${defaultName} (${adoptionName})`
                : defaultName;
              const avatarLetter = defaultName[0].toUpperCase();
              const createdDate = formatDate(
                individual?.created,
                true,
                intl.formatMessage({ id: 'UNKNOWN_DATE' }),
              );

              return (
                <SearchResult
                  key={individualGuid}
                  avatarLetter={avatarLetter}
                  href={`/individuals/${individualGuid}`}
                  onClick={closePopover}
                  primaryText={displayString}
                  secondaryText={
                    <FormattedMessage
                      id="CREATED_ON_DATE"
                      values={{ createdDate }}
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
