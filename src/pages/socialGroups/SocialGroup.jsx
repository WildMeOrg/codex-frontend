import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useSocialGroup from '../../models/socialGroups/useSocialGroup';
import useQueryIndividualsByGuid from '../../models/individual/useQueryIndividualsByGuid';
import usePatchSocialGroup from '../../models/socialGroups/usePatchSocialGroup';
import { formatDate } from '../../utils/formatters';
import RemoveFromSocialGroupDialog from '../../components/dialogs/RemoveFromSocialGroupDialog';
import ActionIcon from '../../components/ActionIcon';
import IndividualsDisplay from '../../components/dataDisplays/IndividualsDisplay';
import InputRow from '../../components/fields/edit/InputRow';
import TextInput from '../../components/inputs/TextInput';
import ErrorDialog from '../../components/dialogs/ErrorDialog';
import ButtonLink from '../../components/ButtonLink';
import Button from '../../components/Button';
import LoadingScreen from '../../components/LoadingScreen';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import AddMembersDialog from './AddMembersDialog';

const nameSchema = { labelId: 'NAME_OF_GROUP' };

export default function SocialGroup() {
  const { guid } = useParams();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [individualToRemove, setIndividualToRemove] = useState(null);

  const openAddDialog = useCallback(() => setAddDialogOpen(true), []);
  const handleCloseAddDialog = useCallback(
    () => setAddDialogOpen(false),
    [],
  );
  const handleCloseDeleteDialog = useCallback(
    () => setIndividualToRemove(null),
    [],
  );

  const { data, loading, error, statusCode } = useSocialGroup(guid);
  const safeMembers = get(data, 'members', {});
  const memberGuids = Object.keys(safeMembers);
  const { data: membersWithData, loading: membersLoading } =
    useQueryIndividualsByGuid(memberGuids);

  const {
    mutate: patchSocialGroup,
    loading: patchLoading,
    error: patchError,
    clearError: clearPatchError,
  } = usePatchSocialGroup();

  const [name, setName] = useState('');

  useEffect(() => {
    if (data?.name) setName(data.name);
  }, [data?.name]);
  useDocumentTitle(data?.name || 'SOCIAL_GROUP', {
    translateMessage: false,
  });

  if (error) return <SadScreen statusCode={statusCode} />;
  if (loading) return <LoadingScreen />;

  const nameChanged = name !== data?.name;
  const safeMembersWithData = membersWithData || [];
  const membersWithRoles = safeMembersWithData.map(member => {
    const membershipData = safeMembers[member?.guid];
    return {
      ...member,
      role: get(membershipData, ['role_guids', 0]),
    };
  });

  return (
    <MainColumn fullWidth>
      <AddMembersDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        socialGroup={data}
      />
      <RemoveFromSocialGroupDialog
        open={Boolean(individualToRemove)}
        onClose={handleCloseDeleteDialog}
        socialGroup={data}
        individualGuid={individualToRemove}
      />
      <ErrorDialog
        open={Boolean(patchError)}
        onClose={clearPatchError}
        errorMessage={patchError}
      />
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 8px 16px' }}
      >
        {data?.name}
      </Text>
      <Text
        variant="subtitle1"
        style={{ paddingLeft: 20 }}
        id="SOCIAL_GROUP_SUBHEADER"
        values={{ dateCreated: formatDate(data?.created, true) }}
      />
      <ButtonLink
        href="/settings/social-groups"
        style={{ margin: '8px 0 0 16px', width: 'fit-content' }}
        display="back"
        id="ALL_SOCIAL_GROUPS"
      />

      <Grid
        container
        direction="column"
        alignItems="center"
        style={{ paddingBottom: 40 }}
      >
        <Grid item style={{ width: '100%' }}>
          <Text
            variant="h6"
            style={{ marginTop: 20, marginLeft: 12 }}
            id="METADATA"
          />
          <Paper
            elevation={2}
            style={{
              marginTop: 20,
              marginBottom: 12,
              padding: '8px 24px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <InputRow schema={nameSchema} loading={false}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextInput
                  schema={nameSchema}
                  value={name}
                  onChange={newName => setName(newName)}
                  variant="outlined"
                />
                {nameChanged && (
                  <div>
                    <Button
                      size="small"
                      display="primary"
                      id="SAVE"
                      loading={patchLoading}
                      onClick={() => patchSocialGroup({ guid, name })}
                    />
                    <Button
                      size="small"
                      disabled={patchLoading}
                      onClick={() => setName(data?.name)}
                      style={{ marginLeft: 4 }}
                      id="UNDO"
                    />
                  </div>
                )}
              </div>
            </InputRow>
          </Paper>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              variant="h6"
              style={{ marginTop: 20, marginLeft: 12 }}
              id="MEMBERS"
            />

            <Button
              style={{ marginTop: 16 }}
              id="ADD_MEMBERS"
              startIcon={<AddIcon />}
              size="small"
              onClick={openAddDialog}
            />
          </div>

          <IndividualsDisplay
            style={{ marginTop: 20 }}
            noTitleBar
            tableSize="medium"
            variant="secondary"
            individuals={membersWithRoles}
            hideFilterSearch
            removeColumns={['adoptionName', 'taxonomy_guid']}
            addColumns={[
              {
                reference: 'actions',
                name: 'guid',
                labelId: 'ACTIONS',
                options: {
                  customBodyRender: individualGuid => {
                    const handleClickDelete = () =>
                      setIndividualToRemove(individualGuid);
                    return (
                      <ActionIcon
                        onClick={handleClickDelete}
                        variant="delete"
                      />
                    );
                  },
                },
              },
            ]}
            loading={membersLoading}
            showNoResultsBao={false}
            noResultsTextId="NO_INDIVIDUALS_IN_SOCIAL_GROUP"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
