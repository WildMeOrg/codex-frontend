import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LabeledInput from './LabeledInput';

export default function({
  open,
  onSave = Function.prototype,
  onClose = Function.prototype,
  fieldValues,
  fieldSchema,
  categories,
}) {
  const categoryArray = categories ? Object.values(categories) : null;

  const initialState = fieldValues.reduce((memo, field) => {
    memo[field.name] = field.value;
    return memo;
  }, {});

  const [formState, setFormState] = useState(initialState);
  const [currentCategory, setCurrentCategory] = useState(
    categories ? categoryArray[0].name : null,
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="EDIT" />
      </DialogTitle>
      <DialogContent style={{ height: 500 }}>
        {categories && (
          <Tabs
            component="h3"
            value={currentCategory}
            style={{ marginTop: 0 }}
            onChange={(_, newCategory) =>
              setCurrentCategory(newCategory)
            }
          >
            {categoryArray.map(category => (
              <Tab
                key={category.name}
                value={category.name}
                label={<FormattedMessage id={category.labelId} />}
              />
            ))}
          </Tabs>
        )}
        <Grid
          container
          spacing={2}
          justify="center"
          style={{ maxWidth: 320 }}
        >
          {fieldValues.map(fieldData => {
            const schema = fieldSchema.find(
              candidateSchema =>
                candidateSchema.name === fieldData.name,
            );

            const matchingCategory = currentCategory
              ? schema.category === currentCategory
              : true;
            if (!matchingCategory) return null;

            return (
              <Grid item key={fieldData.name}>
                <LabeledInput
                  schema={schema}
                  value={formState[fieldData.name]}
                  onChange={newFieldValue => {
                    setFormState({
                      ...formState,
                      [fieldData.name]: newFieldValue,
                    });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions style={{ marginTop: 32 }}>
        <Button
          onClick={() => {
            setFormState(initialState);
            onClose();
          }}
          color="primary"
        >
          <FormattedMessage id="CANCEL" defaultMessage="Cancel" />
        </Button>
        <Button
          onClick={() => {
            onSave(formState);
          }}
          color="primary"
          autoFocus
        >
          <FormattedMessage id="CONFIRM" defaultMessage="Confirm" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
