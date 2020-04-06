import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, filter } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import EncounterGallery from '../../components/EncounterGallery';
import { selectOrgs } from '../../modules/orgs/selectors';
import orgSchema from '../../constants/orgSchema';

export default function Org() {
  const { id } = useParams();

  // fetch data for Id...
  const orgs = useSelector(selectOrgs);

  const org = orgs[id];
  if (!org)
    return (
      <NotFoundPage
        subtitle={
          <FormattedMessage
            id="ORG_NOT_FOUND"
            defaultMessage="Org not found"
          />
        }
      />
    );

  const description = filter(
    get(org, 'fields', []),
    field => field.name === 'description',
  );

  return (
    <MainColumn>
      <EntityHeader
        name={org.name}
        imgSrc={org.profile}
        fieldValues={org.fields}
        fieldSchema={orgSchema}
        editable={org.editable}
        hideFields={['description']}
      >
        <Typography variant="body2">
          {get(description, '0.value')}
        </Typography>
      </EntityHeader>
      <EncounterGallery
        title={
          <FormattedMessage
            id="ENCOUNTERS"
            defaultMessage="Encounters"
          />
        }
        encounters={org.encounters}
      />
    </MainColumn>
  );
}
