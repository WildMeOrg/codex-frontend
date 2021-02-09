import React, { useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import NavigateIcon from '@material-ui/icons/Visibility';
import Link from '../../components/Link';
import Button from '../../components/Button';
import BooleanInput from '../../components/inputs/BooleanInput';

const word = 'HERPADERPAFEEDMEREALDATAPLEAASEE';

export default function MembersModal({
  open,
  onClose = Function.prototype,
  onInvite = Function.prototype,
}) {
  const intl = useIntl();
  const [isModerator, setIsModerator] = useState(false);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width: 600, height: 600 } }}
    >
      <DialogTitle onClose={onClose}>
        <FormattedMessage id="SEND_INVITATION" />
        <IconButton
          style={{ position: 'absolute', top: 8, right: 16 }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{ padding: '8px 12px', overflowX: 'hidden' }}
      >
        <Grid container direction="column">
          <Grid item>
            <Input
              style={{
                margin: '16px 0 20px 16px',
                width: 260,
                maxWidth: '70%',
              }}
              placeholder={intl.formatMessage({ id: 'SEARCH' })}
              value={filter}
              onChange={e => setFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item>
            <List
              dense
              style={{
                height: 300,
                maxHeight: '40vh',
                maxWidth: '70vw',
                overflow: 'scroll',
              }}
            >
              {word.split('').map((character, i) => {
                const isSelected = i === user;
                return (
                  <div key={`${character}-${i}`}>
                    <ListItem
                      button
                      onClick={() => setUser(i)}
                      selected={isSelected}
                    >
                      <ListItemAvatar>
                        <Avatar>{character}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        id="Member name"
                        primary="Firstname Lastname"
                        secondary="Affiliated with University of Denver"
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <Link href="/users/bob">
                            <NavigateIcon />
                          </Link>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </Grid>
          <Grid item style={{ marginTop: 12 }}>
            <BooleanInput
              value={isModerator}
              onChange={value => setIsModerator(value)}
              width={200}
              schema={{
                labelId: 'INVITE_AS_MODERATOR',
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button display="basic" onClick={onClose}>
          <FormattedMessage id="CANCEL" />
        </Button>
        <Button
          display="primary"
          disabled={!user}
          onClick={() => onInvite(user)}
        >
          <FormattedMessage id="SEND_INVITATION" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
