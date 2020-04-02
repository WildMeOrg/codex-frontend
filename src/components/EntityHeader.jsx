import React, { useState } from 'react';
import { capitalize } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import EditProfile from './EditProfile';
import BigAvatar from './BigAvatar';

export default function EntityHeader({
  imgSrc,
  name,
  fieldValues,
  fieldSchema,
  editable,
}) {
  const intl = useIntl();
  const [editingProfile, setEditingProfile] = useState(false);
  return (
    <>
      <Grid container style={{ margin: '24px 0' }}>
        <Grid item>
          <BigAvatar
            imgSrc={imgSrc}
            editable={editable}
            name={name}
          />
        </Grid>
        <Grid item style={{ marginLeft: 28 }}>
          <div style={{ display: 'flex' }}>
            <Typography variant="h4" component="h4">
              {name}
            </Typography>
            {editable && (
              <Button
                style={{ marginLeft: 16 }}
                variant="outlined"
                size="small"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                <FormattedMessage
                  id="EDIT_PROFILE"
                  defaultMessage="Edit Profile"
                />
              </Button>
            )}
          </div>
          <div style={{ marginLeft: 4 }}>
            {fieldValues.map(fieldData => (
              <div
                key={fieldData.name}
                style={{ display: 'flex', marginTop: 4 }}
              >
                <Typography>
                  {`${intl.formatMessage({
                    id: fieldData.name.toUpperCase(),
                    defaultMessage: capitalize(fieldData.name),
                  })}:`}
                </Typography>
                <Typography style={{ marginLeft: 4 }}>
                  {fieldData.value}
                </Typography>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
      <EditProfile
        visible={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldSchema={fieldSchema}
        fieldValues={fieldValues}
      />
      <Divider />
    </>
  );
}
