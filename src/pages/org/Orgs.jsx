import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import MainColumn from '../../components/MainColumn';
import AvatarGallery from '../../components/AvatarGallery';
import ConfirmDelete from '../../components/ConfirmDelete';
import Header from '../../components/Header';
import Text from '../../components/Text';
import { selectOrgs } from '../../modules/orgs/selectors';
import { selectSiteName } from '../../modules/site/selectors';
import { selectIsAdministrator } from '../../modules/app/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import CreateOrg from './CreateOrg';

export default function User() {
  const intl = useIntl();
  const siteName = useSelector(selectSiteName);
  const pageTitle = intl.formatMessage(
    { id: 'ORGS_PAGE_TITLE' },
    { siteName },
  );
  useDocumentTitle(pageTitle, false);

  const orgs = useSelector(selectOrgs);
  const isAdministrator = useSelector(selectIsAdministrator);

  const [creatingOrg, setCreatingOrg] = useState(false);
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
      <CreateOrg
        open={creatingOrg}
        onCreateUser={newUser => {
          console.log(newUser);
        }}
        onClose={() => setCreatingOrg(false)}
      />
      <Header
        title={pageTitle}
        showButton={isAdministrator}
        buttonText={intl.formatMessage({ id: 'CREATE_ORG' })}
        onButtonClick={() => setCreatingOrg(true)}
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
