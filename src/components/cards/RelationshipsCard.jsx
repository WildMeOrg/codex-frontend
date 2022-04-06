import React, { useState } from 'react';
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

import { get } from 'lodash-es';

import Button from '../Button';
import Card from './Card';
import CustomAlert from '../Alert';
import DataDisplay from '../dataDisplays/DataDisplay';
import StandardDialog from '../StandardDialog';
import IndividualSelector from '../IndividualSelector';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../Text';
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
  title,
  titleId = 'SIGHTINGS',
  relationships = [],
  loading,
  noDataMessage = 'NO_RELATIONSHIPS',
}) {
  const intl = useIntl();
  const noRelationships = relationships && relationships.length === 0;
  const error = 'DeleteMe';
  console.log('deleteMe title is: ' + title);
  console.log('deleteMe titleId is: ' + titleId);
  const {
    data: siteSettings,
    loading: loadingRelationships,
    error: relationshipsError,
  } = useSiteSettings();
  const possibleRelationships = get(
    siteSettings,
    ['relationship_type_roles', 'value'],
    [],
  );
  console.log('deleteMe possibleRelationships are: ');
  console.log(possibleRelationships);
  const types = Object.values(possibleRelationships);
  console.log('deleteMe types are: ');
  console.log(types);

  const theme = useTheme();
  const [
    openRelationshipDialog,
    setOpenRelationshipDialog,
  ] = useState(false);
  const [selectedIndividualId, setSelectedIndividualId] = useState(
    null,
  );
  const [currentRoles, setCurrentRoles] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const allValid = selectedIndividualId && currentType && currentRole;
  // const backgroundColor = theme.palette.grey['200'];

  const relationshipCols = [
    {
      reference: 'individual',
      name: 'individual',
      label: 'Individual',
    },
    { reference: 'type', name: 'type', label: 'Type' },
    { reference: 'role', name: 'role', label: 'Role' },
  ];

  const onChangeType = newType => {
    console.log(
      'deleteMe onChangeType inside RelationshipCard triggered and newType is: ',
    );
    console.log(newType);
    setCurrentType(newType);
    setCurrentRoles(get(newType, 'roles', []));
  };

  const onChangeRole = newRole => {
    console.log(
      'deleteMe onChangeRole inside RelationshipCard triggered and newRole is: ',
    );
    console.log(newRole);
    setCurrentRole(newRole);
  };

  const onCloseDialog = () => {
    setSelectedIndividualId(null);
    setOpenRelationshipDialog(false);
  };

  const onSubmit = () => {
    //TODO post relationship
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
          value={get(types, [0])}
          options={types}
          renderOption={option => (
            <Text value={option.guid}>{option.label}</Text>
          )}
          onChange={(_, newValue) => {
            onChangeType(newValue);
          }}
          getOptionLabel={option => get(option, 'label', '')}
          getOptionSelected={option =>
            option.guid
              ? option.guid === get(types, ['0', 'guid'])
              : false
          }
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
        {currentRoles?.length > 0 && (
          <Autocomplete
            value={get(currentRoles, [0])}
            options={currentRoles}
            renderOption={option => {
              console.log('deleteMe option in renderOption is: ');
              console.log(option);
              return <Text value={option.guid}>{option.label}</Text>;
            }}
            onChange={(_, newValue) => {
              console.log(
                'deleteMe onChange autocomplete for type triggered. newValue is: ',
              );
              console.log(newValue);
              onChangeRole(get(newValue, 'guid', ''));
            }}
            getOptionLabel={option => {
              console.log('deleteMe option is: ');
              console.log(option);
              return get(option, 'label', 'deleteMeShouldNotGetHere');
            }}
            getOptionSelected={option =>
              option.guid
                ? option.guid === get(types, ['0', 'guid'])
                : false
            }
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
        )}
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
                noTitleBar
                tableSize="medium"
                columns={relationshipCols}
                data={relationships}
                loading={loading}
              />
            )}
          </IconButton>
        </div>
      }
    >
      <Button
        id="ADD_RELATIONSHIP"
        display="basic"
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
