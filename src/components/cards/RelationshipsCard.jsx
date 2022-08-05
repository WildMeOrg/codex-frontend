import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// import { useTheme } from '@material-ui/core/styles';
// import IconButton from '@material-ui/core/IconButton';
// import ViewChart from '@material-ui/icons/BubbleChart';
// import ViewList from '@material-ui/icons/ViewList';

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

// Keeping this in because it will be re-implemented post-MVP
// import SvgText from '../SvgText';
// import FemaleIcon from '../svg/FemaleIcon';
// import MaleIcon from '../svg/MaleIcon';
// import SexUnsureIcon from '../svg/SexUnsureIcon';

// const linkLength = 35;

// const colorMap = {
//   Brother: '#66c2a5',
//   Mother: '#fc8d62',
//   Friend: '#8da0cb',
// };

// const sexIconMap = {
//   Male: MaleIcon,
//   Female: FemaleIcon,
//   Unsure: SexUnsureIcon,
// };

// const Node = function({
//   x,
//   y,
//   fill,
//   title,
//   subtitle,
//   linkColor,
//   Icon,
//   size = 8,
// }) {
//   const theme = useTheme();
//   const linkStroke = linkColor || theme.palette.grey['900'];

//   return (
//     <g>
//       <line
//         x1={x}
//         y1={y}
//         x2={50}
//         y2={50}
//         stroke={linkStroke}
//         strokeWidth={0.5}
//       />
//       <circle
//         cx={x}
//         cy={y}
//         r={size}
//         fill={fill}
//         stroke={linkStroke}
//         strokeWidth={0.5}
//       />
//       {Icon && (
//         <Icon
//           style={{ transform: `translate(${x}px, ${y - 5.5}px)` }}
//         />
//       )}
//       <SvgText x={x} y={subtitle ? y + 2.5 : y + 1} fontSize="2.75">
//         {title}
//       </SvgText>
//       {subtitle && (
//         <SvgText x={x} y={y + 5.5} fontSize="2">
//           {subtitle}
//         </SvgText>
//       )}
//     </g>
//   );
// };

export default function RelationshipsCard({
  relationships = [],
  individualGuid,
  loading,
  noDataMessageId = 'NO_RELATIONSHIPS',
  title,
  titleId,
}) {
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
  const types = useMemo(() => {
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
        relationship => {
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

  const onDelete = async relationshipGuid => {
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

  const onChangeType = newType => {
    setCurrentType(newType);
    setCurrentRole1(null);
    setCurrentRole2(null);
    setCurrentRoles(get(newType, 'roles', []));
  };

  const onChangeRole1 = newRole => {
    setCurrentRole1(newRole);
  };

  const onChangeRole2 = newRole => {
    setCurrentRole2(newRole);
  };

  const onCloseDialog = () => {
    setSelectedIndividualGuid(null);
    setOpenRelationshipDialog(false);
    setCurrentType(null);
    setCurrentRole1(null);
    setCurrentRole2(null);
    clearPostRelationshipError();
    clearDeleteRelationshipError();
  };

  const onSubmit = async () => {
    const response = await postRelationship({
      individual_1_guid: individualGuid,
      individual_2_guid: selectedIndividualGuid,
      individual_1_role_guid: currentRole1?.guid,
      individual_2_role_guid: currentRole2?.guid,
      type_guid: currentType?.guid,
    });
    if (response?.status === 200) {
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
      onDelete={async () => {
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
      titleId="ADD_RELATIONSHIP"
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
            id="ADD_RELATIONSHIP"
          />
        </div>
      </DialogActions>
    </StandardDialog>,
    <Card title={title} titleId={titleId}>
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
          id={noDataMessageId}
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
        id="ADD_RELATIONSHIP"
        display="primary"
        loading={loading || loadingRelationships}
        startIcon={<AddIcon />}
        size="small"
        onClick={() => setOpenRelationshipDialog(true)}
      />
      {/* {relationships.length === 0 ? (
        <Text style={{ marginTop: 8, marginBottom: 12 }}>
          This individual has no relationships.
        </Text>
      ) : (
        <div>
          <svg viewBox="0 0 100 100">
            <rect
              x={0}
              width={100}
              y={0}
              height={100}
              fill={backgroundColor}
            />
            {relationships.map((relationship, i) => {
              const currentAngle =
                (i * 2 * Math.PI) / relationships.length -
                0.5 * Math.PI;
              const x = Math.sin(currentAngle) * linkLength + 50;
              const y = Math.cos(currentAngle) * linkLength + 50;

              const Icon = sexIconMap[relationship.sex];
              return (
                <Node
                  title={relationship.individual}
                  subtitle={relationship.type}
                  x={x}
                  y={y}
                  fill={colorMap[relationship.type]}
                  Icon={Icon}
                />
              );
            })}
            <Node
              title="Teddy"
              x={50}
              y={50}
              size={10}
              fill={theme.palette.grey['100']}
            />
          </svg>
        </div>
      )} */}
    </Card>,
  ];
}
