import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
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
        subtitle={<FormattedMessage id="ORG_NOT_FOUND" />}
      />
    );

  return (
    <MainColumn>
      <EntityHeader
        name={org.name}
        imgSrc={org.profile}
        fieldValues={org.fields}
        fieldSchema={orgSchema}
        editable={org.editable}
      />
      <EncounterGallery
        title={<FormattedMessage id="AFFILIATED_ENCOUNTERS" />}
        encounters={org.encounters}
      />
    </MainColumn>
  );
}
