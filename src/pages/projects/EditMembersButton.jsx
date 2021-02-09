import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import MembersModal from './MembersModal';
import InviteModal from './InviteModal';

export default function EditMembersButton() {
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div>
      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
      <MembersModal
        open={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        setInviteModalOpen={setInviteModalOpen}
      />
      <IconButton
        onClick={() => setMembersModalOpen(true)}
        size="small"
        aria-label="Manage members"
      >
        <EditIcon />
      </IconButton>
    </div>
  );
}
