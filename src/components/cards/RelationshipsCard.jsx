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
import usePostRelationship from '../../models/relationships/usePostRelationship';
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
  console.log('deleteMe self guid is: ' + individualGuid);
  const intl = useIntl();
  const noRelationships = relationships && relationships.length === 0;
  // const error = 'DeleteMe';
  const error = null;
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
    success: postRelationshipSuccess,
    clearSuccess: clearPostRelationshipSuccess,
  } = usePostRelationship();

  const theme = useTheme();
  const [
    openRelationshipDialog,
    setOpenRelationshipDialog,
  ] = useState(false);
  const [selectedIndividualId, setSelectedIndividualId] = useState(
    null,
  );
  const [currentRoles, setCurrentRoles] = useState(null);
  console.log('deleteMe got here and currentRoles is: ');
  console.log(currentRoles);
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
      //TOOD
      console.log('deleteMe in relationshipTableData');
      return map(
        relationships,
        relationship => {
          const nonSelfIndividualMembers = filter(
            get(relationship, 'individual_members'),
            individualMember =>
              individualMember.individual_guid !== individualGuid,
          );
          let nonSelfIndividualMember = get(
            nonSelfIndividualMembers,
            [0],
          ); // TODO deleteMe change to const once the hard-coded assignment below is fixed
          nonSelfIndividualMember.individual_first_name = 'deleteMe';
          return {
            guid: relationship?.guid,
            nonSelfFirstName:
              nonSelfIndividualMember?.individual_first_name,
            nonSelfGuid: nonSelfIndividualMember?.individual_guid,
            type: relationship.type_label,
            role: nonSelfIndividualMember?.individual_role_label,
          };
        },
        [],
      );
    },
    [relationships],
  );

  const relationshipCols = [
    {
      reference: 'nonSelfFirstName',
      name: 'nonSelfFirstName',
      label: 'Individual',
    },
    { reference: 'type', name: 'type', label: 'Type' },
    { reference: 'role', name: 'role', label: 'Role' },
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
    setOpenRelationshipDialog(false);
  };

  const onSubmit = async () => {
    console.log('deleteMe onsubmit clicked!');
    //TODO post relationship
    const successful = await postRelationship({
      individual_1_guid: individualGuid,
      individual_2_guid: selectedIndividualId,
      individual_1_role_guid: currentRole1?.guid,
      individual_2_role_guid: currentRole2?.guid,
      type_guid: currentType?.guid,
    });
    console.log('deleteMe successful for postRelationship is: ');
    console.log(successful);
  };

  return [
    <StandardDialog
      open={openRelationshipDialog}
      onClose={onCloseDialog}
      titleId={'ADD_RELATIONSHIP'}
    >
      <DialogContent>
        <IndividualSelector
          setSelectedIndividualId={setSelectedIndividualId}
        />
        <Autocomplete
          id="types"
          clearOnEscape
          style={{ marginTop: 12 }}
          value={currentType}
          options={types}
          renderOption={option => (
            <Text value={option.guid}>{option.label}</Text>
          )}
          onChange={(_, newValue) => onChangeType(newValue)}
          getOptionLabel={option => get(option, 'label', '')} //     ? option.guid === get(types, ['0', 'guid']) //   option.guid // getOptionSelected={option =>
          renderInput={params => {
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
                  label={intl.formatMessage({
                    id: 'SELECT_RELATIONSHIP_ROLE_1',
                    values: {
                      ind2: relationshipTableData?.nonSelfFirstName
                        ? relationshipTableData?.nonSelfFirstName
                        : 'UNNAMED_INDIVIDUAL',
                      ind1: individualFirstName
                        ? individualFirstName
                        : 'UNNAMED_INDIVIDUAL',
                    },
                  })}
                />
              );
            }}
          />,
          <Autocomplete
            id="roles2"
            clearOnEscape
            style={{ marginTop: 12 }}
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
                    { id: 'SELECT_RELATIONSHIP_ROLE_2' },
                    {
                      ind1: individualFirstName
                        ? individualFirstName
                        : 'UNNAMED_INDIVIDUAL',
                    },
                    {
                      ind2: relationshipTableData?.nonSelfFirstName
                        ? relationshipTableData?.nonSelfFirstName
                        : 'UNNAMED_INDIVIDUAL',
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
        {error && (
          <CustomAlert
            style={{ margin: '20px 0', width: '100%' }}
            severity="error"
            titleId="SERVER_ERROR"
          >
            {error}
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
            loading={loading}
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
