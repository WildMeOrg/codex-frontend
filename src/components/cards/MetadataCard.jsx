import React from 'react';
import { range } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import Button from '../Button';
import Text from '../Text';
import Card from './Card';

const badValues = [null, undefined, ''];
function fieldValueGood(field) {
  console.log('deleteMe field in fieldValueGood is: ');
  console.log(field);
  const value = field?.value;
  console.log('deleteMe and its value is: ');
  console.log(value);
  if (badValues.includes(value)) return false;
  if (Array.isArray(value)) {
    if (value?.length < 1) return false;
    const removeNulls = value.filter(entry => entry !== null); //for lat/long, although a legit 0,0 lat/long comes back as [null, null] currently, so it'll be a blindspot for us.
    if (removeNulls?.length < 1) return false;
  }

  if (value?.time === null && value?.timeSpecificity === null)
    return false;
  return true;
}

export default function MetadataCard({
  title,
  titleId = 'METADATA',
  metadata,
  editable = false,
  showDefaultValues = true,
  editButtonId = 'REPORT_METADATA',
  onEdit,
}) {
  const metadataToDisplay = metadata.filter(field => {
    console.log('deleteMe current field is: ');
    console.log(field);
    const valid = !field?.hideInMetadataCard && fieldValueGood(field);
    console.log('deleteMe valid is: ');
    console.log(valid);
    const passedDefaultValueCheck = showDefaultValues
      ? true
      : JSON.stringify(field?.value) !==
        JSON.stringify(field?.defaultValue);
    console.log('deleteMe passedDefaultValueCheck is: ');
    console.log(passedDefaultValueCheck);
    return valid && passedDefaultValueCheck;
  });

  const showEditButton = metadataToDisplay.length === 0 && editable;
  const showEditIcon = editable && !showEditButton;

  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        showEditIcon ? (
          <IconButton
            onClick={onEdit}
            size="small"
            aria-label="Edit metadata"
          >
            <EditIcon />
          </IconButton>
        ) : (
          undefined
        )
      }
    >
      <List dense>
        {metadata
          ? metadataToDisplay.map(field => {
              const viewComponentProps =
                field?.viewComponentProps || {};

              return (
                <ListItem key={field?.id || field?.name}>
                  {field?.icon && (
                    <ListItemIcon style={{ minWidth: 36 }}>
                      <field.icon />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={
                      <Text
                        component="span"
                        variant="caption"
                        id={field?.labelId}
                      >
                        {field?.label}
                      </Text>
                    }
                    secondary={
                      <field.viewComponent
                        value={field?.value}
                        choices={field?.choices}
                        schema={field}
                        {...viewComponentProps}
                      />
                    }
                  />
                </ListItem>
              );
            })
          : range(6).map(i => (
              <ListItem key={i}>
                <ListItemText
                  primary={<Skeleton />}
                  secondary={<Skeleton />}
                />
              </ListItem>
            ))}
      </List>
      {showEditButton && (
        <Button
          id={editButtonId}
          display="panel"
          onClick={onEdit}
          style={{ width: '100%' }}
        />
      )}
    </Card>
  );
}
