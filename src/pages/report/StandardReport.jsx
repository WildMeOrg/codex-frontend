import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { some, values } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  selectSightingSchema,
  selectSightingCategories,
} from '../../modules/sightings/selectors';
import { selectSiteName } from '../../modules/site/selectors';
import { getLocationSuggestion } from '../../utils/exif';
import LabeledInput from '../../components/LabeledInput';
import Button from '../../components/Button';
import InlineButton from '../../components/InlineButton';
import BigExpansionPanel from '../../components/BigExpansionPanel';
import Callout from '../../components/Callout';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';

export default function StandardReport({
  exifData,
  variant,
  onBack,
}) {
  const intl = useIntl();
  const categories = useSelector(selectSightingCategories);
  const schema = useSelector(selectSightingSchema);
  const siteName = useSelector(selectSiteName);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [exifButtonClicked, setExifButtonClicked] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [termsError, setTermsError] = useState(false);
  const categoryList = values(categories);

  const [formValues, setFormValues] = useState(
    schema.reduce((memo, field) => {
      memo[field.name] = field.defaultValue;
      return memo;
    }, {}),
  );

  const locationSuggestion = useMemo(
    () => getLocationSuggestion(exifData),
    [exifData],
  );

  return (
    <>
      <TermsAndConditionsDialog
        visible={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <Grid item>
        <Button
          onClick={onBack}
          style={{ marginTop: 8 }}
          display="back"
        >
          <FormattedMessage id="BACK_TO_PHOTOS" />
        </Button>
      </Grid>
      <Grid item>
        {categoryList.map(category => {
          const inputsInCategory = schema.filter(
            f => f.category === category.name,
          );
          const requiredCategory =
            category.required ||
            some(inputsInCategory, input => input.required);

          if (variant === 'multiple' && category.individualFields)
            return null;

          const showExifData =
            category.name === 'location' &&
            locationSuggestion &&
            !exifButtonClicked;

          return (
            <BigExpansionPanel
              key={category.name}
              defaultExpanded={category.name === 'general'}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${
                  category.name
                }-filter-panel-content`}
                id={`${category.name}-filter-panel-header`}
              >
                <Typography variant="subtitle1">
                  {category.labelId ? (
                    <FormattedMessage id={category.labelId} />
                  ) : (
                    category.label
                  )}
                  {requiredCategory && ' *'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {category.descriptionId && (
                    <Typography
                      variant="subtitle2"
                      style={{ marginBottom: 12 }}
                    >
                      <FormattedMessage id={category.descriptionId} />
                    </Typography>
                  )}
                  {showExifData && (
                    <Callout
                      title={
                        <FormattedMessage id="IMAGE_METADATA_DETECTED" />
                      }
                      description={
                        <FormattedMessage id="LOCATION_METADATA_DETECTED" />
                      }
                      actions={
                        <Button
                          display="primary"
                          onClick={() => {
                            setFormValues({
                              ...formValues,
                              location: locationSuggestion,
                            });
                            setExifButtonClicked(true);
                          }}
                        >
                          <FormattedMessage id="AUTOFILL_FIELDS" />
                        </Button>
                      }
                    />
                  )}
                  {inputsInCategory.map(input => (
                    <div
                      key={`${category.name} - ${input.name}`}
                      style={{
                        display: 'flex',
                        marginBottom: 12,
                      }}
                    >
                      <Hidden xsDown>
                        <Typography
                          style={{
                            marginRight: 16,
                            marginTop: 20,
                            width: 180,
                            textAlign: 'right',
                          }}
                        >
                          <FormattedMessage id={input.labelId} />
                          {input.required && ' *'}
                        </Typography>
                      </Hidden>
                      <LabeledInput
                        minimalLabels={input.fieldType === 'file'}
                        schema={input}
                        value={formValues[input.name]}
                        onChange={value => {
                          setFormValues({
                            ...formValues,
                            [input.name]: value,
                          });
                        }}
                        width={220}
                      />
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </BigExpansionPanel>
          );
        })}
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptEmails}
              onChange={() => setAcceptEmails(!acceptEmails)}
            />
          }
          label={
            <FormattedMessage
              id="ONE_SIGHTING_EMAIL_CONSENT"
              values={{ siteName }}
            />
          }
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
          }
          label={
            <span>
              <FormattedMessage id="TERMS_CHECKBOX_1" />
              <InlineButton onClick={() => setDialogOpen(true)}>
                <FormattedMessage id="TERMS_CHECKBOX_2" />
              </InlineButton>
              <FormattedMessage id="END_OF_SENTENCE" />
            </span>
          }
        />
      </Grid>
      <Grid
        item
        style={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          onClick={() => {
            // check that required fields are complete
            const nextIncompleteFields = schema.filter(
              field =>
                field.required &&
                field.defaultValue === formValues[field.name],
            );
            setIncompleteFields(nextIncompleteFields);

            // check that terms and conditions were accepted
            setTermsError(!acceptedTerms);

            if (nextIncompleteFields.length === 0 && acceptedTerms) {
              console.log('Time to report the sighting');
              setLoading(true);
              setTimeout(() => {
                console.log('Sighting submitted');
                setLoading(false);
              }, 150000);
            }
          }}
          style={{ width: 200 }}
          loading={loading}
          display="primary"
        >
          <FormattedMessage id="REPORT_SIGHTING" />
        </Button>
      </Grid>
      <Grid style={{ marginTop: 12 }} item>
        {termsError && (
          <Typography color="error">
            <FormattedMessage id="TERMS_ERROR" />
          </Typography>
        )}
        {incompleteFields.map(incompleteField => (
          <Typography key={incompleteField.name} color="error">
            <FormattedMessage
              id="INCOMPLETE_FIELD"
              values={{
                fieldName: intl.formatMessage({
                  id: incompleteField.labelId,
                }),
              }}
            />
          </Typography>
        ))}
      </Grid>
    </>
  );
}
