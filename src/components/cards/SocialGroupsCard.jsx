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
import IndividualSelector from '../IndividualSelector';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../Text';
import usePostRelationship from '../../models/relationships/usePostRelationship';
import ConfirmDelete from '../ConfirmDelete';
import RelationshipDisplay from '../dataDisplays/RelationshipDisplay';
import RelationshipRoleAutocomplete from '../inputs/RelationshipRoleAutocomplete';
import useDeleteRelationships from '../../models/relationships/useDeleteRelationship';

export default function RelationshipsCard({
  relationships = [],
  individualGuid,
  loading,
  noDataMessage = 'NO_SOCIAL_GROUPS',
  title,
  titleId,
})
{
  const intl = useIntl();
  const noRelationships =
    Array.isArray(relationships) && relationships.length === 0;
  const { data: siteSettings, loading: loadingRelationships } =
    useSiteSettings();
  const {
    mutate: postRelationship,
    error: postRelationshipError,
    loading: postRelationshipLoading,
    clearError: clearPostRelationshipError,
  } = usePostRelationship();

  console.log(siteSettings);
  const {
    mutate: deleteRelationship,
    loading: deleteRelationshipLoading,
    error: deleteRelationshipError,
    clearError: clearDeleteRelationshipError,
  } = useDeleteRelationships();

  // const theme = useTheme();
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    relationshipGuid: null,
    open: false,
  });
  const [openRelationshipDialog, setOpenRelationshipDialog] =
    useState(false);
  const [selectedIndividualGuid, setSelectedIndividualGuid] =
    useState(null);
  const [currentRoles, setCurrentRoles] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentRole1, setCurrentRole1] = useState(null);
  const [currentRole2, setCurrentRole2] = useState(null);
  const allValid =
    selectedIndividualGuid &&
    currentType &&
    currentRole1 &&
    currentRole2;
  const types = useMemo(() =>
  {
    const possibleRelationships = get(
      siteSettings,
      ['relationship_type_roles', 'value'],
      {},
    );
    const _types = Object.values(possibleRelationships);
    setCurrentRoles(get(_types, 'roles', []));
    return _types;
  }, [siteSettings]);
  const relationshipTableData = useMemo(
    () =>
      map(
        relationships,
        relationship =>
        {
          const selfIndividualMember = find(
            get(relationship, 'individual_members'),
            individualMember =>
              individualMember.individual_guid === individualGuid,
          );
          const nonSelfIndividualMember = find(
            get(relationship, 'individual_members', []),
            individualMember =>
              individualMember.individual_guid !== individualGuid,
          );
          return {
            guid: relationship?.guid,
            nonSelfFirstName:
              nonSelfIndividualMember?.individual_first_name,
            nonSelfGuid: nonSelfIndividualMember?.individual_guid,
            type: relationship?.type_label,
            role: selfIndividualMember?.individual_role_label,
          };
        },
        [],
      ),
    [relationships],
  );

  const onDelete = async relationshipGuid =>
  {
    const response = await deleteRelationship({
      relationshipGuid,
      individualGuid,
    });
    if (response?.status === 204)
      setConfirmDeleteDialog({
        realtionshipGuid: null,
        open: false,
      });
  };

  const onChangeType = newType =>
  {
    setCurrentType(newType);
    setCurrentRole1(null);
    setCurrentRole2(null);
    setCurrentRoles(get(newType, 'roles', []));
  };

  const onChangeRole1 = newRole =>
  {
    setCurrentRole1(newRole);
  };

  const onChangeRole2 = newRole =>
  {
    setCurrentRole2(newRole);
  };

  const onCloseDialog = () =>
  {
    setSelectedIndividualGuid(null);
    setOpenRelationshipDialog(false);
    setCurrentType(null);
    setCurrentRole1(null);
    setCurrentRole2(null);
    clearPostRelationshipError();
    clearDeleteRelationshipError();
  };

  const onSubmit = async () =>
  {
    const response = await postRelationship({
      individual_1_guid: individualGuid,
      individual_2_guid: selectedIndividualGuid,
      individual_1_role_guid: currentRole1?.guid,
      individual_2_role_guid: currentRole2?.guid,
      type_guid: currentType?.guid,
    });
    if (response?.status === 200)
    {
      onCloseDialog();
    }
  };

  const showRoleSelectors =
    selectedIndividualGuid && currentRoles?.length > 0;

  return [
    <ConfirmDelete
      open={confirmDeleteDialog?.open}
      onClose={() =>
        setConfirmDeleteDialog({
          realtionshipGuid: null,
          open: false,
        })
      }
      onDelete={async () =>
      {
        onDelete(confirmDeleteDialog?.relationshipGuid);
      }}
      deleteInProgress={deleteRelationshipLoading}
      error={deleteRelationshipError}
      onClearError={clearDeleteRelationshipError}
      messageId="CONFIRM_REMOVE_RELATIONSHIP"
    />,
    <StandardDialog
      open={openRelationshipDialog}
      onClose={onCloseDialog}
      titleId="ADD_SOCIAL_TO_GROUP"
    >
      <DialogContent>
        <IndividualSelector
          excludedIndividuals={[individualGuid]}
          setSelectedIndividualGuid={setSelectedIndividualGuid}
        />
        {selectedIndividualGuid && (
          <div
            id="relationship-type"
            style={{ width: 'fit-content', minWidth: 470 }}
          >
            <Autocomplete
              id="types"
              clearOnEscape
              style={{ marginTop: 12 }}
              value={currentType}
              options={types}
              renderOption={option => (
                <Text value={option?.guid}>{option?.label}</Text>
              )}
              onChange={(_, newValue) => onChangeType(newValue)}
              getOptionLabel={option => get(option, 'label', '')}
              renderInput={params => (
                <TextField
                  {...params}
                  style={{ minWidth: 470, width: 'fit-content' }}
                  variant="standard"
                  label={intl.formatMessage({
                    id: 'SELECT_RELATIONSHIP_TYPE',
                  })}
                />
              )}
            />
          </div>
        )}
        {showRoleSelectors && [
          <RelationshipRoleAutocomplete
            id="roles1"
            value={currentRole1}
            options={currentRoles}
            onChangeRole={onChangeRole1}
            individualId={individualGuid}
          />,
          <RelationshipRoleAutocomplete
            id="roles2"
            value={currentRole2}
            options={currentRoles}
            onChangeRole={onChangeRole2}
            individualId={selectedIndividualGuid}
          />,
        ]}
      </DialogContent>
      <DialogActions
        style={{
          padding: '0px 24px 24px 24px',
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        {postRelationshipError && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="SERVER_ERROR"
          >
            <Text variant="body2">{postRelationshipError}</Text>
          </CustomAlert>
        )}
        <div>
          <Button
            display="basic"
            onClick={onCloseDialog}
            id="CANCEL"
          />
          <Button
            display="primary"
            onClick={onSubmit}
            loading={
              loading ||
              loadingRelationships ||
              postRelationshipLoading
            }
            disabled={!allValid}
            id="ADD_SOCIAL_TO_GROUP"
          />
        </div>
      </DialogActions>
    </StandardDialog>,
    <Card title={title} titleId={titleId} maxHeight={600}>
      {/* // renderActions={
      //   <div>
      //     <IconButton
      //       style={{ color: theme.palette.primary.main }}
      //       aria-label="View chart"
      //     >
      //       <ViewChart />
      //     </IconButton>
      //     <IconButton
      //       aria-label="View list"
      //       style={{ color: theme.palette.primary.main }}
      //     />
      //   </div>
      // } */}
      {noRelationships && (
        <Text
          variant="body2"
          id={noDataMessage}
          style={{ marginTop: 12 }}
        />
      )}
      {!noRelationships && (
        <RelationshipDisplay
          tableSize="medium"
          data={relationshipTableData}
          loading={loading}
          setConfirmDeleteDialog={setConfirmDeleteDialog}
        />
      )}

      <Button
        style={{ marginTop: 16 }}
        id="ADD_SOCIAL_TO_GROUP"
        display="primary"
        loading={loading || loadingRelationships}
        startIcon={<AddIcon />}
        size="small"
        onClick={() => setOpenRelationshipDialog(true)}
      />
    </Card>,
  ];
}
