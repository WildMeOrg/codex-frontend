import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { selectSiteSettings } from '../../modules/site/selectors';
import siteSettingsSchema from '../../constants/siteSettingsSchema';
import LabeledInput from '../../components/LabeledInput';

export default function SiteSettings() {
  const siteSettings = useSelector(selectSiteSettings);

  console.log(siteSettings);

  const [formValues, setFormValues] = useState(
    siteSettingsSchema.reduce((memo, field) => {
      memo[field.name] = siteSettings[field.name];
      return memo;
    }, {}),
  );
  console.log(formValues);

  return (
    <Grid container direction="column" style={{ marginTop: 40 }}>
      {siteSettingsSchema.map(settingSchema => {
        if (settingSchema.hidden) return null;

        return (
          <Grid
            key={settingSchema.name}
            item
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                style={{
                  marginTop: 20,
                }}
                variant="subtitle1"
              >
                <FormattedMessage id={settingSchema.labelId} />
                {settingSchema.required && ' *'}
              </Typography>
              <Typography
                style={{
                  marginTop: 4,
                }}
              >
                <FormattedMessage id={settingSchema.descriptionId} />
              </Typography>
            </div>
            <div
              style={{ marginTop: 24, marginLeft: 80, minWidth: 300 }}
            >
              <LabeledInput
                schema={settingSchema}
                minimalLabels
                value={formValues[settingSchema.name]}
                onChange={value => {
                  console.log(value);
                  setFormValues({
                    ...formValues,
                    [settingSchema.name]: value,
                  });
                }}
                width={232}
              />
            </div>
          </Grid>
        );
      })}
      <Grid
        item
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 40,
        }}
      >
        <Button variant="contained" color="secondary">
          Save changes
        </Button>
      </Grid>
    </Grid>
  );
}
