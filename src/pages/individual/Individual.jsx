import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, capitalize, toLower } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SexIcon from '@material-ui/icons/Nature';
import AgeIcon from '@material-ui/icons/Height';
import StatusIcon from '@material-ui/icons/LocalHospital';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import EncounterGallery from '../../components/EncounterGallery';
import EditProfile from '../../components/EditEntityModal';
import { selectIndividuals } from '../../modules/individuals/selectors';
import { selectSpeciesFields } from '../../modules/site/selectors';
import useIndividuals from '../../modules/individuals/useIndividuals';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const items = [
  {
    key: 'sex',
    icon: SexIcon,
    render: sex => (
      <FormattedMessage id="PROFILE_LABEL_SEX" values={{ sex }} />
    ),
  },
  {
    key: 'age',
    icon: AgeIcon,
    render: age => (
      <FormattedMessage id="PROFILE_LABEL_AGE" values={{ age }} />
    ),
  },
  {
    key: 'status',
    icon: StatusIcon,
    render: status => (
      <FormattedMessage
        id="PROFILE_LABEL_STATUS"
        values={{ status }}
      />
    ),
  },
];

export default function Individual() {
  const { id } = useParams();

  /* not using API results because API is not ready */
  const [results, error] = useIndividuals([id]);

  // fetch data for Id...
  const individuals = useSelector(selectIndividuals);
  const speciesFields = useSelector(selectSpeciesFields);
  useDocumentTitle(capitalize(id));
  const [editingProfile, setEditingProfile] = useState(false);

  const individual = individuals[toLower(id)];
  if (!individual)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="INDIVIDUAL_NOT_FOUND" />}
      />
    );

  const fieldSchema = speciesFields[individual.species];

  return (
    <MainColumn>
      <EditProfile
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={individual.fields}
        fieldSchema={fieldSchema}
      />
      <EntityHeader
        name={individual.name}
        imgSrc={individual.profile}
        editable={individual.editable}
        onSettingsClick={() => setEditingProfile(true)}
      >
        <Grid container direction="column" spacing={1}>
          {items.map(item => {
            const matchingData = individual.fields.find(
              field => field.name === item.key,
            );
            const matchingSchemaObject = fieldSchema.find(
              schemaObject => schemaObject.name === item.key,
            );

            const fieldValue = get(matchingData, 'value', null);
            if (!matchingData || !matchingSchemaObject) return null;
            if (matchingSchemaObject.defaultValue === fieldValue)
              return null;

            const Icon = item.icon;

            return (
              <Grid key={item.key} item style={{ display: 'flex' }}>
                <Icon color="action" style={{ marginRight: 8 }} />
                <Typography>
                  {item.render(matchingData.value)}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </EntityHeader>
      <EncounterGallery
        hideIndividual
        title={
          <FormattedMessage
            id="SIGHTINGS_OF"
            values={{ name: individual.name }}
          />
        }
        encounters={individual.encounters}
      />
    </MainColumn>
  );
}
