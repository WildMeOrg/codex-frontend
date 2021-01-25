import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '../../components/Button';
import InlineButton from '../../components/InlineButton';
import Text from '../../components/Text';
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
          <Text variant="h6" id="MEMBERS" />
        </Grid>
        <Grid item>
          <InlineButton onClick={() => setMembersModalOpen(true)}>
            <Text id="MEMBER_COUNT" values={{ memberCount: 561 }} />
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
      <div>
        <Button
          onClick={() => setInviteModalOpen(true)}
          style={{ marginTop: 12 }}
          display="panel"
        >
          <FormattedMessage id="SEND_INVITATION" />
        </Button>
      </div>
    </div>
  );
}
