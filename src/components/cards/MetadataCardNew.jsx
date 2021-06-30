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

export default function MetadataCard({
  title,
  titleId = 'METADATA',
  metadata,
  editable = false,
  showDefaultValues = false,
  editButtonId = 'REPORT_METADATA',
  onEdit,
}) {
  let metadataToDisplay = metadata;
  if (!showDefaultValues)
    metadataToDisplay = metadata.filter(
      field =>
        JSON.stringify(field.value) !==
        JSON.stringify(field.defaultValue),
    );

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
                field.viewComponentProps || {};

              return (
                <ListItem key={field.id || field.name}>
                  {field.icon && (
                    <ListItemIcon style={{ minWidth: 36 }}>
                      <field.icon />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={
                      <Text
                        component="span"
                        variant="caption"
                        id={field.labelId}
                      >
                        {field.label}
                      </Text>
                    }
                    secondary={
                      <field.viewComponent
                        value={field.value}
                        choices={field.choices}
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
