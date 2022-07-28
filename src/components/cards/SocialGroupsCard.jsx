import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { get, map, find } from 'lodash-es';

import Button from '../Button';
import Card from './Card';
import CustomAlert from '../Alert';
import StandardDialog from '../StandardDialog';
import AddToSocialGroupDialog from '../dialogs/AddToSocialGroupDialog';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../Text';
import usePatchSocialGroup from '../../models/socialGroups/usePatchSocialGroup';
import ConfirmDelete from '../ConfirmDelete';
import RelationshipDisplay from '../dataDisplays/RelationshipDisplay';
import RelationshipRoleAutocomplete from '../inputs/RelationshipRoleAutocomplete';

export default function SocialGroupsCard({
  socialGroups = [],
  individualGuid,
  loading,
  noDataMessage = 'NO_SOCIAL_GROUPS',
  title,
  titleId,
}) {
  const intl = useIntl();
  const noSocialGroups =
    Array.isArray(socialGroups) && socialGroups.length === 0;
  const { data: siteSettings, loading: siteSettingsLoading } =
    useSiteSettings();
  const {
    mutate: patchSocialGroup,
    error: patchError,
    loading: patchLoading,
    clearError: clearPatchError,
  } = usePatchSocialGroup();

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return [
    <ConfirmDelete
      open={false}
      onClose={Function.prototype}
      onDelete={Function.prototype}
      deleteInProgress={false}
      error={null}
      onClearError={false}
      messageId="CONFIRM_REMOVE_RELATIONSHIP"
    />,
    <AddToSocialGroupDialog
      open={addDialogOpen}
      onClose={() => setAddDialogOpen(false)}
    />,
    <StandardDialog
      open={false}
      onClose={Function.prototype}
      titleId="ADD_SOCIAL_TO_GROUP"
    >
      <DialogContent>
        {/* <IndividualSelector
          excludedIndividuals={[individualGuid]}
          setSelectedIndividualGuid={setSelectedIndividualGuid}
        /> */}
      </DialogContent>
      <DialogActions
        style={{
          padding: '0px 24px 24px 24px',
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        {false && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="SERVER_ERROR"
          >
            <Text variant="body2">{false}</Text>
          </CustomAlert>
        )}
        <div>
          <Button
            display="basic"
            onClick={Function.prototype}
            id="CANCEL"
          />
          <Button
            display="primary"
            onClick={Function.prototype}
            loading={false}
            disabled={false}
            id="ADD_SOCIAL_TO_GROUP"
          />
        </div>
      </DialogActions>
    </StandardDialog>,
    <Card title={title} titleId={titleId} maxHeight={600}>
      {noSocialGroups ? (
        <Text
          variant="body2"
          id={noDataMessage}
          style={{ marginTop: 12 }}
        />
      ) : (
        <RelationshipDisplay
          tableSize="medium"
          data={[]}
          loading={loading}
          setConfirmDeleteDialog={Function.prototype}
        />
      )}

      <Button
        style={{ marginTop: 16 }}
        id="ADD_TO_SOCIAL_GROUP"
        display="primary"
        loading={loading}
        startIcon={<AddIcon />}
        size="small"
        onClick={() => setAddDialogOpen(true)}
      />
    </Card>,
  ];
}
