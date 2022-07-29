import React, { useCallback, useState } from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import useSiteSettings from '../../models/site/useSiteSettings';
import usePatchSocialGroup from '../../models/socialGroups/usePatchSocialGroup';
import CustomAlert from '../../components/Alert';
import InputRow from '../../components/fields/edit/InputRow';
import IndividualSelector from '../../components/IndividualSelector';
import Button from '../../components/Button';
import StandardDialog from '../../components/StandardDialog';

export default function AddMembersDialog({
  open,
  onClose,
  socialGroup,
}) {
  const [selectedIndividualGuid, setSelectedIndividualGuid] =
    useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const { data: siteSettings } = useSiteSettings();
  const {
    mutate: patchSocialGroup,
    error: patchError,
    loading: patchLoading,
    clearError: clearPatchError,
  } = usePatchSocialGroup();

  const handleClose = useCallback(() => {
    setSelectedIndividualGuid(null);
    setSelectedRole('');
    if (patchError) clearPatchError();
    onClose();
  }, [patchError]);

  const roles = get(
    siteSettings,
    ['social_group_roles', 'value'],
    [],
  );

  const formComplete = Boolean(
    selectedIndividualGuid && selectedRole,
  );

  return (
    <StandardDialog
      open={open}
      onClose={handleClose}
      titleId="ADD_TO_SOCIAL_GROUP"
      maxWidth="xl"
    >
      <DialogContent>
        <IndividualSelector
          width="100%"
          setSelectedIndividualGuid={setSelectedIndividualGuid}
        />
        <InputRow schema={{ labelId: 'ROLE' }}>
          <FormControl>
            <InputLabel>
              <FormattedMessage id="ROLE" />
            </InputLabel>
            <Select
              style={{ width: 200 }}
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              {roles.map(role => (
                <MenuItem key={role?.guid} value={role?.guid}>
                  {role?.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </InputRow>
      </DialogContent>
      <DialogActions
        style={{
          padding: '0px 24px 24px 24px',
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        {patchError && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="SERVER_ERROR"
          >
            {patchError}
          </CustomAlert>
        )}
        <div>
          <Button
            style={{ marginRight: 4 }}
            onClick={handleClose}
            id="CLOSE"
          />
          <Button
            disabled={!formComplete}
            display="primary"
            loading={patchLoading}
            onClick={async () => {
              const newMembers = {
                ...(socialGroup?.members || {}),
                [selectedIndividualGuid]: {
                  role_guids: [selectedRole],
                },
              };
              const result = await patchSocialGroup({
                guid: socialGroup?.guid,
                members: newMembers,
                affectedIndividualGuids: [selectedIndividualGuid],
              });
              if (result.status === 200) handleClose();
            }}
            id="ADD"
          />
        </div>
      </DialogActions>
    </StandardDialog>
  );
}
