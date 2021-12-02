import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import MainColumn from '../../components/MainColumn';
import AvatarGallery from '../../components/AvatarGallery';
import ConfirmDelete from '../../components/ConfirmDelete';
import Header from '../../components/Header';
import Text from '../../components/Text';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const intl = useIntl();
  useDocumentTitle('ORGANIZATIONS');

  const orgs = [];
  const isAdministrator = true;

  const [orgToDelete, setOrgToDelete] = useState(null);
  const deleteOrganizationName = get(
    orgToDelete,
    'name',
    'Unknown org',
  );

  const flatOrgs = Object.values(orgs);

  const fakeOrgs = [
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
    ...flatOrgs,
  ];

  return (
    <MainColumn>
      <ConfirmDelete
        onClose={() => setOrgToDelete(null)}
        onDelete={() => setOrgToDelete(null)}
        open={Boolean(orgToDelete)}
        entityToDelete={deleteOrganizationName}
      />
      <Header
        titleId="ORGANIZATIONS"
        showButtonLink={isAdministrator}
        buttonText={intl.formatMessage({ id: 'CREATE_ORG' })}
        buttonLinkHref="/create/org"
      />
      <AvatarGallery
        square
        entities={fakeOrgs}
        getHref={entity => `/orgs/${entity.id}`}
        canDelete={isAdministrator}
        onDelete={entity => {
          setOrgToDelete(entity);
        }}
        renderDetails={org => {
          const memberCount = get(org, 'data.members.length', null);
          return <Text id="MEMBER_COUNT" values={{ memberCount }} />;
        }}
      />
    </MainColumn>
  );
}
