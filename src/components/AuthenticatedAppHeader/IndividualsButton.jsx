import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import ExploreIcon from '@material-ui/icons/FilterList';

import { deriveIndividualName } from '../../utils/nameUtils';
import { formatDate } from '../../utils/formatters';
import useOnEnter from '../../hooks/useOnEnter';
import useIndividualTermQuery from '../../models/individual/useIndividualTermQuery';
import Button from '../Button';
import Text from '../Text';
import Link from '../Link';

export default function IndividualsButton() {
  const intl = useIntl();
  const theme = useTheme();
  const title = intl.formatMessage({ id: 'INDIVIDUALS' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputContent, setInputContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: searchResults,
    loading,
    error,
  } = useIndividualTermQuery(searchTerm);

  useOnEnter(() => {
    if (inputContent !== '') setSearchTerm(inputContent);
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const resultsCurrent = inputContent === searchTerm;
  const noResults = searchResults && searchResults.length === 0;
  const mappableSearchResults = resultsCurrent
    ? searchResults || []
    : [];
  const showDivider = resultsCurrent && (error || searchResults);

  return (
    <div>
      <Button
        aria-describedby={id}
        display="primary"
        onClick={event => {
          setAnchorEl(event.currentTarget);
        }}
        style={{
          backgroundColor: theme.palette.grey.A100,
          color: theme.palette.grey.A400,
          marginLeft: 8,
        }}
        startIcon={<SearchIcon />}
      >
        {title}
      </Button>
      <Backdrop open={open} />
      <Popover
        marginThreshold={0}
        onClose={handleClose}
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            width: 600,
            borderRadius: 20,
            backgroundColor: theme.palette.grey['200'],
            paddingBottom: 20,
          },
        }}
      >
        <TextField
          style={{ padding: 16 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress
                  size={24}
                  style={{ color: theme.palette.text.primary }}
                />
              </InputAdornment>
            ) : (
              undefined
            ),
            disableUnderline: true,
            autoFocus: true,
            placeholder:
              'Search for an individual by name, alias, or guid',
          }}
          value={inputContent}
          onChange={e => {
            setInputContent(e.target.value);
          }}
          fullWidth
        />
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
          {mappableSearchResults.map(individual =>
          {
            const individualGuid = individual?.guid;
            const adoptionName = deriveIndividualName(individual, 'AdoptionName');
            const defaultName = deriveIndividualName(individual, 'FirstName', 'Unnamed Individual');
            const displayString = adoptionName
              ? `${defaultName} (${adoptionName})`
              : defaultName;
            const avatarLetter = defaultName[0].toUpperCase();
            const createdDate = formatDate(individual?.created, true, 'Unknown date');

            return (
              <ListItem key={individualGuid}>
                <ListItemAvatar>
                  <Avatar>{avatarLetter}</Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Link
                      onClick={handleClose}
                      href={`/individuals/${individualGuid}`}
                      noUnderline
                    >
                      {displayString}
                    </Link>
                  }
                  secondary={
                    <Text variant="caption">{`Created on ${createdDate}`}</Text>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Link
          onClick={handleClose}
          href="/individuals"
          noUnderline
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0 0 16px',
          }}
        >
          <ExploreIcon fontSize="small" />
          <Text
            style={{
              paddingLeft: 8,
              color: theme.palette.text.secondary,
            }}
            id="EXPLORE_INDIVIDUALS"
          />
        </Link>
      </Popover>
    </div>
  );
}
