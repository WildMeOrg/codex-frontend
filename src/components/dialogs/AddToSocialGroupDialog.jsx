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
import useSocialGroups from '../../models/socialGroups/useSocialGroups';
import InputRow from '../fields/edit/InputRow';
import Text from '../Text';
import Button from '../Button';
import StandardDialog from '../StandardDialog';

export default function AddToSocialGroupDialog({ open, onClose }) {
  const {
    data: socialGroups,
    loading,
    error,
    statusCode,
  } = useSocialGroups();
  const { data: siteSettings, loading: siteSettingsLoading } =
    useSiteSettings();

  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleClose = useCallback(() => {
    setSelectedGroup('');
    setSelectedRole('');
    onClose();
  }, []);

  const safeSocialGroups = socialGroups || [];
  const roles = get(
    siteSettings,
    ['social_group_roles', 'value'],
    [],
  );

  const formComplete = Boolean(selectedGroup && selectedRole);
  console.log(siteSettings);

  return (
    <StandardDialog
      open={open}
      onClose={handleClose}
      titleId="ADD_TO_SOCIAL_GROUP"
      maxWidth="xl"
    >
      <DialogContent>
        <InputRow schema={{ labelId: 'SOCIAL_GROUP' }}>
          <FormControl>
            <InputLabel>
              <FormattedMessage id="SOCIAL_GROUP" />
            </InputLabel>
            <Select
              style={{ width: 200 }}
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
            >
              {safeSocialGroups.map(group => (
                <MenuItem value={group?.guid}>{group?.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </InputRow>
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
                <MenuItem value={role?.guid}>{role?.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </InputRow>
      </DialogContent>
      <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
        <Button onClick={handleClose} id="CLOSE" />
        <Button
          disabled={!formComplete}
          display="primary"
          onClick={handleClose}
          id="ADD"
        />
      </DialogActions>
    </StandardDialog>
  );
}
