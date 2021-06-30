import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormHelperText from '@material-ui/core/FormHelperText';
import SearchIcon from '@material-ui/icons/Search';

import useDescription from '../../../hooks/useDescription';
import { selectSearchResults } from '../../../modules/individuals/selectors';
import DeleteButton from '../../DeleteButton';
import Button from '../../Button';
import Text from '../../Text';
import StandardDialog from '../../StandardDialog';

export default function IndividualEditor({
  schema,
  value,
  onChange,
  minimalLabels = false,
  ...rest
}) {
  const intl = useIntl();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndividual, setSelectedIndividual] = useState(null);
  const [filter, setFilter] = useState('');

  const description = useDescription(schema);
  const showDescription = !minimalLabels && description;

  const individuals = useSelector(selectSearchResults);

  const onClose = () => setModalOpen(false);

  return (
    <div>
      {!value && (
        <Button
          size="small"
          style={{ marginTop: 16 }}
          onClick={() => setModalOpen(true)}
          id="SELECT_INDIVIDUAL"
          {...rest}
        />
      )}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text>{value}</Text>
          <DeleteButton
            onClick={() => {
              onChange(null);
            }}
          />
        </div>
      )}
      {showDescription ? (
        <FormHelperText style={{ maxWidth: 220 }}>
          <FormattedMessage id={description} />
        </FormHelperText>
      ) : null}
      <StandardDialog
        open={modalOpen}
        onClose={onClose}
        titleId="SELECT_INDIVIDUAL"
      >
        <DialogContent style={{ marginBottom: 24 }}>
          <Input
            style={{ margin: '16px 0 20px 16px', width: 260 }}
            placeholder={intl.formatMessage({ id: 'SEARCH' })}
            value={filter}
            onChange={e => setFilter(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
          <List style={{ width: 380, maxWidth: '70vw', height: 380 }}>
            {individuals.map(individual => {
              const isSelected = selectedIndividual === individual.id;
              const filterMatchId = individual.id
                .toLowerCase()
                .includes(filter.toLowerCase());
              const filterMatchAlias = individual.alias
                .toLowerCase()
                .includes(filter.toLowerCase());
              if (!isSelected && !filterMatchId && !filterMatchAlias)
                return null;

              const lastSeenDate = format(
                individual.lastSeen,
                'M/dd/yy',
              );
              const lastSeenMessage = intl.formatMessage(
                { id: 'LAST_SEEN_DATE' },
                { date: lastSeenDate },
              );
              return (
                <div key={individual.id}>
                  <ListItem
                    button
                    onClick={() =>
                      setSelectedIndividual(individual.id)
                    }
                    selected={isSelected}
                  >
                    <ListItemText
                      primary={`${individual.id} (${
                        individual.alias
                      })`}
                      secondary={lastSeenMessage}
                    />
                  </ListItem>
                </div>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
          <Button
            id="CANCEL"
            display="basic"
            onClick={() => {
              onChange(null);
              setSelectedIndividual(null);
              onClose();
            }}
          />
          <Button
            id="CONFIRM"
            display="primary"
            onClick={() => {
              onChange(selectedIndividual);
              setSelectedIndividual(null);
              onClose();
            }}
          />
        </DialogActions>
      </StandardDialog>
    </div>
  );
}
