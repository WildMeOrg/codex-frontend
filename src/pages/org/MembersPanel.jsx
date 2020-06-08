import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';
import IconButton from '@material-ui/core/IconButton';
import InlineButton from '../../components/InlineButton';
import Link from '../../components/Link';

const word = 'HERPADERPAFEEDMEREALDATAPLEAASEE';

export default function MembersPanel() {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [changes, setChanges] = useState({});
  const onClose = () => setModalOpen(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '8px 4px',
        padding: '8px 16px',
        borderRadius: 8,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Dialog
        open={modalOpen}
        onClose={onClose}
        PaperProps={{ style: { width: 600, height: 600 } }}
      >
        <DialogTitle onClose={onClose}>
          <FormattedMessage id="MEMBERS" />
          <IconButton
            style={{ position: 'absolute', top: 8, right: 16 }}
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ padding: '8px 12px' }}>
          <Typography
            variant="subtitle1"
            style={{ padding: '0 16px' }}
          >
            <FormattedMessage
              id="MEMBER_COUNT"
              values={{ memberCount: 561 }}
            />
          </Typography>
          <List>
            {word.split('').map((character, i) => {
              const role = i < 3 ? 'moderator' : 'member';
              const roleTranslateId =
                role === 'moderator' ? 'MODERATOR' : 'MEMBER';
              const newRole =
                get(changes, [i, 'action']) === 'CHANGE_ROLE'
                  ? changes[i].value
                  : role;
              const deletedUser =
                get(changes, [i, 'action']) === 'DELETE';

              return (
                <ListItem key={`${character}-${i}`}>
                  <ListItemAvatar>
                    <Avatar>{character}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    id="Member name"
                    primary={
                      <Link href="/users/bob">
                        Firstname Lastname
                      </Link>
                    }
                    secondary={
                      <FormattedMessage id={roleTranslateId} />
                    }
                  />
                  <ListItemSecondaryAction>
                    {deletedUser ? (
                      <IconButton
                        onClick={() => {
                          const newChanges = { ...changes };
                          delete newChanges[i];
                          setChanges(newChanges);
                        }}
                      >
                        <UndoIcon />
                      </IconButton>
                    ) : (
                      <>
                        <Select
                          value={newRole}
                          onChange={event => {
                            const newChanges = { ...changes };
                            const newValue = event.target.value;
                            if (newValue === role) {
                              delete newChanges[i];
                            } else {
                              newChanges[i] = {
                                action: 'CHANGE_ROLE',
                                value: newValue,
                              };
                            }
                            setChanges(newChanges);
                          }}
                        >
                          <MenuItem value="moderator">
                            <FormattedMessage id="MODERATOR" />
                          </MenuItem>
                          <MenuItem value="member">
                            <FormattedMessage id="MEMBER" />
                          </MenuItem>
                        </Select>
                        <IconButton
                          onClick={() => {
                            const newChanges = { ...changes };
                            newChanges[i] = { action: 'DELETE' };
                            setChanges(newChanges);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        {Object.keys(changes).length > 0 && (
          <DialogActions>
            <Button>
              <FormattedMessage id="CANCEL" />
            </Button>
            <Button>
              <FormattedMessage id="SAVE_CHANGES" />
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <Typography variant="h6">
            <FormattedMessage id="MEMBERS" />
          </Typography>
        </Grid>
        <Grid item>
          <InlineButton onClick={() => setModalOpen(true)}>
            <Typography>
              <FormattedMessage
                id="MEMBER_COUNT"
                values={{ memberCount: 561 }}
              />
            </Typography>
          </InlineButton>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={1}
        style={{ marginTop: 4, height: 52, overflow: 'hidden' }}
      >
        {word.split('').map((character, i) => (
          <Grid key={`${character}-${i}`} item>
            <Avatar>{character}</Avatar>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
