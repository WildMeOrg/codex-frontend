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
import useSocialGroup from '../../models/socialGroups/useSocialGroup';
import useSocialGroups from '../../models/socialGroups/useSocialGroups';
import usePatchSocialGroup from '../../models/socialGroups/usePatchSocialGroup';
import CustomAlert from '../Alert';
import InputRow from '../fields/edit/InputRow';
import Button from '../Button';
import StandardDialog from '../StandardDialog';

export default function AddToSocialGroupDialog({
  open,
  onClose,
  individualGuid,
}) {
  const [selectedGroupGuid, setSelectedGroupGuid] = useState('');
  const [selectedRoleGuid, setSelectedRoleGuid] = useState('');

  const {
    data: socialGroups,
    loading: socialGroupsLoading,
    error: getSocialGroupsError,
  } = useSocialGroups();
  const {
    data: siteSettings,
    loading: siteSettingsLoading,
    error: getSiteSettingsError,
  } = useSiteSettings();
  const {
    data: selectedGroupData,
    loading: selectedGroupDataLoading,
    error: getSelectedGroupError,
  } = useSocialGroup(selectedGroupGuid);
  const {
    mutate: patchSocialGroup,
    loading: patchLoading,
    error: patchError,
    clearError: clearPatchError,
  } = usePatchSocialGroup();

  const handleClose = useCallback(() => {
    setSelectedGroupGuid('');
    setSelectedRoleGuid('');
    if (patchError) clearPatchError();
    onClose();
  }, [patchError]);

  const safeSocialGroups = socialGroups || [];
  const roles = get(
    siteSettings,
    ['social_group_roles', 'value'],
    [],
  );

  const fetchError =
    getSocialGroupsError ||
    getSiteSettingsError ||
    getSelectedGroupError;
  const formComplete = Boolean(selectedGroupGuid && selectedRoleGuid);

  return (
    <StandardDialog
      open={open}
      onClose={handleClose}
      titleId="ADD_TO_SOCIAL_GROUP"
      maxWidth="xl"
    >
      <DialogContent>
        {fetchError && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="AN_ERROR_OCCURRED"
          >
            {fetchError}
          </CustomAlert>
        )}
        <InputRow
          loading={socialGroupsLoading}
          schema={{ labelId: 'SOCIAL_GROUP' }}
        >
          <FormControl>
            <InputLabel>
              <FormattedMessage id="SOCIAL_GROUP" />
            </InputLabel>
            <Select
              style={{ width: 200 }}
              value={selectedGroupGuid}
              onChange={e => setSelectedGroupGuid(e.target.value)}
              disabled={Boolean(fetchError)}
            >
              {safeSocialGroups.map(group => (
                <MenuItem key={group?.guid} value={group?.guid}>
                  {group?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </InputRow>
        <InputRow
          loading={siteSettingsLoading}
          schema={{ labelId: 'ROLE' }}
        >
          <FormControl>
            <InputLabel>
              <FormattedMessage id="ROLE" />
            </InputLabel>
            <Select
              style={{ width: 200 }}
              value={selectedRoleGuid}
              onChange={e => setSelectedRoleGuid(e.target.value)}
              disabled={Boolean(fetchError)}
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
            disabled={selectedGroupDataLoading || !formComplete}
            display="primary"
            loading={patchLoading}
            onClick={async () => {
              const newMembers = {
                ...(selectedGroupData?.members || {}),
                [individualGuid]: { role_guids: [selectedRoleGuid] },
              };
              const result = await patchSocialGroup({
                guid: selectedGroupGuid,
                members: newMembers,
                affectedIndividualGuids: [individualGuid],
              });
              if (result?.status === 200) handleClose();
            }}
            id="ADD"
          />
        </div>
      </DialogActions>
    </StandardDialog>
  );
}
