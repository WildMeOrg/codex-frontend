import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import InlineButton from '../../components/InlineButton';
import MembersModal from './MembersModal';
import InviteModal from './InviteModal';

const word = 'HERPADERPAFEEDMEREALDATAPLEAASEE';

export default function MembersPanel() {
  const theme = useTheme();
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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
      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
      <MembersModal
        open={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
      />
      <Grid container alignItems="center" justify="space-between">
        <Grid item style={{ display: 'flex' }}>
          <Typography variant="h6">
            <FormattedMessage id="MEMBERS" />
          </Typography>
          <Button
            onClick={() => setInviteModalOpen(true)}
            style={{ marginLeft: 16 }}
            size="small"
          >
            <FormattedMessage id="SEND_INVITATION" />
          </Button>
        </Grid>
        <Grid item>
          <InlineButton onClick={() => setMembersModalOpen(true)}>
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
