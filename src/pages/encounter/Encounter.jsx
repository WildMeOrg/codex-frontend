import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { toLower } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import Link from '../../components/Link';
import {
  selectEncounters,
  selectEncounterSchema,
} from '../../modules/encounters/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Status from './Status';

export default function Encounter() {
  const { id } = useParams();

  // fetch data for Id...
  const encounters = useSelector(selectEncounters);
  const schema = useSelector(selectEncounterSchema);
  useDocumentTitle(`Encounter ${id}`);

  const encounter = encounters.find(e => e.id === toLower(id));
  console.log('here', encounters, encounter);

  if (!encounter)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="ENCOUNTER_NOT_FOUND" />}
      />
    );

  const encounterFields = [
    {
      name: 'species',
      value: 'Grampus Griseus',
    },
    {
      name: 'sightingDate',
      value: new Date(),
    },
    {
      name: 'encounterContext',
      value: 'Research effort',
    },
  ];

  return (
    <MainColumn>
      <EntityHeader
        name={encounter.id}
        imgSrc={encounter.profile}
        fieldValues={[]}
        fieldSchema={schema}
        editable
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 4,
          }}
        >
          <Typography>
            <FormattedMessage
              id="ENTITY_HEADER_SPECIES"
              values={{ species: encounter.species }}
            />
          </Typography>
          <Typography>
            <FormattedMessage
              id="ENTITY_HEADER_REGION"
              values={{ region: encounter.region }}
            />
          </Typography>
          <Typography>
            <FormattedMessage
              id="ENTITY_HEADER_CONTEXT"
              values={{ context: encounter.context }}
            />
          </Typography>
          <Typography>
            <FormattedMessage id="ENTITY_HEADER_SUBMITTER" />
            <Link href={`/users/${encounter.userId}`}>
              {encounter.user}
            </Link>
          </Typography>
        </div>
      </EntityHeader>
      <Status />
    </MainColumn>
  );
}
