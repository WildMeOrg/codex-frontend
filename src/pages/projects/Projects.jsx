import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import MainColumn from '../../components/MainColumn';
import AvatarGallery from '../../components/AvatarGallery';
import ConfirmDelete from '../../components/ConfirmDelete';
import Header from '../../components/Header';
import Text from '../../components/Text';
import { selectIsAdministrator } from '../../modules/app/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import CreateOrg from './CreateProject';
import fakeProjects from './fakeProjects';

export default function Projects() {
  const intl = useIntl();
  const pageTitle = intl.formatMessage(
    { id: 'PROJECTS_PAGE_TITLE' },
  );
  useDocumentTitle(pageTitle, false);

  const isAdministrator = useSelector(selectIsAdministrator);

  const [creatingProject, setCreatingProject] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const deleteOrganizationName = get(
    projectToDelete,
    'name',
    'Unknown org',
  );

  const displayProjecs = [
    ...fakeProjects,
    ...fakeProjects,
    ...fakeProjects,
    ...fakeProjects,
  ];

  return (
    <MainColumn>
      <ConfirmDelete
        onClose={() => setProjectToDelete(null)}
        onDelete={() => setProjectToDelete(null)}
        open={Boolean(projectToDelete)}
        entityToDelete={deleteOrganizationName}
      />
      <CreateOrg
        open={creatingProject}
        onCreateUser={newUser => {
          console.log(newUser);
        }}
        onClose={() => setCreatingProject(false)}
      />
      <Header
        title={pageTitle}
        showButton={isAdministrator}
        buttonText={intl.formatMessage({ id: 'CREATE_PROJECT' })}
        onButtonClick={() => setCreatingProject(true)}
      />
      <AvatarGallery
        square
        entities={displayProjecs}
        getHref={entity => `/projects/${entity.id}`}
        canDelete={isAdministrator}
        onDelete={entity => {
          setProjectToDelete(entity);
        }}
        renderDetails={org => {
          const memberCount = get(org, 'data.members.length', null);
          return <Text id="MEMBER_COUNT" values={{ memberCount }} />;
        }}
      />
    </MainColumn>
  );
}
