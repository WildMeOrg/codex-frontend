import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { capitalize } from 'lodash-es';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import EncounterGallery from '../../components/EncounterGallery';
import { selectUsers } from '../../modules/users/selectors';
import userSchema from '../../constants/userSchema';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const { id } = useParams();
  useDocumentTitle(capitalize(id));

  // fetch data for Id...
  const users = useSelector(selectUsers);

  const user = users[id];
  if (!user)
    return (
      <NotFoundPage
        subtitle={<FormattedMessage id="USER_NOT_FOUND" />}
      />
    );

  const galleryTitle = user.editable
    ? 'YOUR_ENCOUNTERS'
    : 'USERS_ENCOUNTERS';
  const translationValues = user.editable
    ? undefined
    : { name: user.name };

  return (
    <MainColumn>
      <EntityHeader
        name={user.name}
        imgSrc={user.profile}
        fieldValues={user.fields}
        fieldSchema={userSchema}
        editable={user.editable}
      />
      <EncounterGallery
        title={
          <FormattedMessage
            id={galleryTitle}
            values={translationValues}
          />
        }
        encounters={user.encounters}
        hideSubmitted
      />
    </MainColumn>
  );
}
