import React, { useState, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { Autocomplete } from '@material-ui/lab';
import { useTheme } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
// import ViewChart from '@material-ui/icons/BubbleChart';
// import ViewList from '@material-ui/icons/ViewList';

import { get, map, filter } from 'lodash-es';

import Button from '../Button';
import Card from './Card';
import CustomAlert from '../Alert';
import DataDisplay from '../dataDisplays/DataDisplay';
import StandardDialog from '../StandardDialog';
import IndividualSelector from '../IndividualSelector';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../Text';
import ActionIcon from '../ActionIcon';
import usePostRelationship from '../../models/relationships/usePostRelationship';
import ConfirmDelete from '../../components/ConfirmDelete';
import useDeleteRelationships from '../../models/relationships/useDeleteRelationship';
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
  individualFirstName,
  loading,
  noDataMessage = 'NO_RELATIONSHIPS',
  title,
  titleId,
}) {
  const intl = useIntl();
  const noRelationships = relationships && relationships.length === 0;
  const {
    data: siteSettings,
    loading: loadingRelationships,
    error: relationshipsError,
  } = useSiteSettings();
  const {
    mutate: postRelationship,
    error: postRelationshipError,
    loading: postRelationshipLoading,
    clearError: clearPostRelationshipError,
    clearSuccess: clearPostRelationshipSuccess,
  } = usePostRelationship();

  const {
    mutate: deleteRelationship,
    loading: deleteRelationshipLoading,
    error: deleteRelationshipError,
    clearError: clearDeleteRelationshipError,
  } = useDeleteRelationships();

  // const [errors, setErrors] = useState([]);
  // setErrors(prevErrors => [
  //   ...prevErrors,
  //   'temp error hi',
  //   relationshipsError,
  //   postRelationshipError,
  // ]);
  const errors = ['deleteMe'];
  const hasActualError =
    errors.filter(error => Boolean(error)).length > 0;
  const theme = useTheme();
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    relationshipGuid: null,
    open: false,
  });
  const [
    openRelationshipDialog,
    setOpenRelationshipDialog,
  ] = useState(false);
  const [selectedIndividualId, setSelectedIndividualId] = useState(
    null,
  );
  const [
    selectedIndividualFirstName,
    setSelectedIndividualFirstName,
  ] = useState(null);
  const [currentRoles, setCurrentRoles] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentRole1, setCurrentRole1] = useState(null);
  const [currentRole2, setCurrentRole2] = useState(null);
  const allValid =
    selectedIndividualId &&
    currentType &&
    currentRole1 &&
    currentRole2;
  const types = useMemo(
    () => {
      const possibleRelationships = get(
        siteSettings,
        ['relationship_type_roles', 'value'],
        [],
      );
      const _types = Object.values(possibleRelationships);
      console.log('deleteMe setting roles to: ');
      console.log(get(_types, 'roles', []));
      setCurrentRoles(get(_types, 'roles', []));
      return _types;
    },
    [siteSettings],
  );
  const relationshipTableData = useMemo(
    () => {
      return map(
        relationships,
        relationship => {
          // const selfIndividualMembers = filter(
          //   get(relationship, 'individual_members'),
          //   individualMember =>
          //     individualMember.individual_guid !== individualGuid,
          //   [],
          // );
          // const selfIndividualMember = get(selfIndividualMembers, [
          //   0,
          // ]);
          const nonSelfIndividualMembers = filter(
            get(relationship, 'individual_members'),
            individualMember =>
              individualMember.individual_guid !== individualGuid,
            [],
          );
          const nonSelfIndividualMember = get(
            nonSelfIndividualMembers,
            [0],
          );
          return {
            guid: relationship?.guid,
            nonSelfFirstName:
              nonSelfIndividualMember?.individual_first_name,
            nonSelfGuid: nonSelfIndividualMember?.individual_guid,
            type: relationship?.type_label,
            role: nonSelfIndividualMember?.individual_role_label,
          };
        },
        [],
      );
    },
    [relationships],
  );

  const onDelete = async relationshipGuid => {
    console.log('deleteMe got here onDelete entered');
    const response = await deleteRelationship({
      relationshipGuid,
      individualGuid,
    });
    console.log('deleteMe response from relationship delete is: ');
    console.log(response);
    if (response?.status === 204)
      setConfirmDeleteDialog({
        realtionshipGuid: null,
        open: false,
      });
  };

  const relationshipCols = [
    {
      reference: 'nonSelfFirstName',
      name: 'nonSelfFirstName',
      label: 'Individual',
    },
    { reference: 'type', name: 'type', label: 'Type' },
    { reference: 'role', name: 'role', label: 'Role' },
    {
      reference: 'actions',
      name: 'guid',
      label: 'Actions',
      options: {
        customBodyRender: (_, relationship) => {
          console.log(
            'deleteMe relationship in customBodyRender is: ',
          );
          console.log(relationship);
          return [
            <ActionIcon
              variant="view"
              href={`/individuals/${relationship?.nonSelfGuid}`}
            />,
            <ActionIcon
              variant={'delete'}
              onClick={() => {
                setConfirmDeleteDialog({
                  relationshipGuid: relationship?.guid,
                  open: true,
                });
              }}
            />,
          ];
        },
      },
    },
  ];

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
    setSelectedIndividualId(null);
    setSelectedIndividualFirstName(null);
    setOpenRelationshipDialog(false);
    setCurrentType(null);
    setCurrentRole1(null);
    setCurrentRole2(null);
    // setErrors([]);
  };

  const onSubmit = async () => {
    const response = await postRelationship({
      individual_1_guid: individualGuid,
      individual_2_guid: selectedIndividualId,
      individual_1_role_guid: currentRole1?.guid,
      individual_2_role_guid: currentRole2?.guid,
      type_guid: currentType?.guid,
    });
    console.log('deleteMe successful for postRelationship is: ');
    if (response?.status === 200) {
      // onCloseDialog(); // TODO deleteMe comment this back in after error troubleshooting is done
    }
  };

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
      titleId={'ADD_RELATIONSHIP'}
    >
      <DialogContent>
        <IndividualSelector
          setSelectedIndividualId={setSelectedIndividualId}
          setSelectedIndividualFirstName={
            setSelectedIndividualFirstName
          }
        />
        <Autocomplete
          id="types"
          clearOnEscape
          style={{ marginTop: 12, width: 'fit-content' }}
          value={currentType}
          options={types}
          renderOption={option => (
            <Text value={option.guid}>{option.label}</Text>
          )}
          onChange={(_, newValue) => onChangeType(newValue)}
          getOptionLabel={option => get(option, 'label', '')}
          renderInput={params => {
            //     ? option.guid === get(types, ['0', 'guid']) //   option.guid // getOptionSelected={option =>
            return (
              <TextField
                {...params}
                style={{ width: 280 }}
                variant="standard"
                label={intl.formatMessage({
                  id: 'SELECT_RELATIONSHIP_TYPE',
                })}
              />
            );
          }}
        />
        {currentRoles?.length > 0 && [
          <Autocomplete
            id="roles1"
            clearOnEscape
            style={{ marginTop: 12, width: 'fit-content' }}
            value={currentRole2}
            options={currentRoles}
            renderOption={option => (
              <Text value={option.guid}>{option.label}</Text>
            )}
            onChange={(_, newValue) => onChangeRole2(newValue)}
            getOptionLabel={option => get(option, 'label', '')}
            getOptionSelected={(option, val) =>
              option.guid ? option.guid === val : false
            }
            renderInput={params => {
              return (
                <TextField
                  {...params}
                  style={{ width: 280 }}
                  variant="standard"
                  label={intl.formatMessage(
                    { id: 'SELECT_RELATIONSHIP_ROLE_1' },
                    {
                      // ind2: selectedIndividualFirstName, // deleteMe
                      ind1: individualFirstName
                        ? individualFirstName
                        : intl.formatMessage({
                            id: 'UNNAMED_INDIVIDUAL',
                          }),
                    },
                  )}
                />
              );
            }}
          />,
          <Autocomplete
            id="roles2"
            clearOnEscape
            style={{ marginTop: 12 }}
            value={currentRole1}
            options={currentRoles}
            renderOption={option => (
              <Text value={option.guid}>{option.label}</Text>
            )}
            onChange={(_, newValue) => onChangeRole1(newValue)}
            getOptionLabel={option => get(option, 'label', '')}
            getOptionSelected={(option, val) =>
              option.guid ? option.guid === val : false
            }
            renderInput={params => {
              return (
                <TextField
                  {...params}
                  style={{ width: 280 }}
                  variant="standard"
                  label={intl.formatMessage(
                    { id: 'SELECT_RELATIONSHIP_ROLE_2' },
                    {
                      // ind1: individualFirstName // deleteMe
                      //   ? individualFirstName
                      //   : intl.formatMessage({
                      //       id: 'UNNAMED_INDIVIDUAL',
                      //     }),
                      ind2: selectedIndividualFirstName,
                    },
                  )}
                />
              );
            }}
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
        {hasActualError && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="SERVER_ERROR"
          >
            {errors.map(error => (
              <Text key={error} variant="body2">
                {error}
              </Text>
            ))}
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
            onClick={() => onSubmit()}
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
    <Card
      title={title}
      titleId={titleId}
      maxHeight={600}
      renderActions={
        <div>
          {/* <IconButton
            style={{ color: theme.palette.primary.main }}
            aria-label="View chart"
          >
            <ViewChart />
          </IconButton> */}
          <IconButton
            aria-label="View list"
            style={{ color: theme.palette.primary.main }}
          />
        </div>
      }
    >
      {noRelationships && (
        <Text
          variant="body2"
          id={noDataMessage}
          style={{ marginTop: 12 }}
        />
      )}
      {!noRelationships && (
        <DataDisplay
          tableSize="medium"
          columns={relationshipCols}
          data={relationshipTableData}
          loading={loading}
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
