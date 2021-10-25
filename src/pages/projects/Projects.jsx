import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import MainColumn from '../../components/MainColumn';
import ConfirmDelete from '../../components/ConfirmDelete';
import Header from '../../components/Header';
import Link from '../../components/Link';
import DataDisplay from '../../components/dataDisplays/DataDisplay';
import { selectIsAdministrator } from '../../modules/app/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import CreateProject from './CreateProject';
import fakeProjects from './fakeProjects';

export default function Projects() {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({ id: 'PROJECTS_PAGE_TITLE' });
  useDocumentTitle(pageTitle, { translateMessage: false });

  const isAdministrator = useSelector(selectIsAdministrator);

  const [creatingProject, setCreatingProject] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const deleteOrganizationName = get(
    projectToDelete,
    'name',
    'Unknown org',
  );

  const displayProjects = [
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
      <CreateProject
        open={creatingProject}
        onCreateProject={newProject => {
          console.log(newProject);
        }}
        onClose={() => setCreatingProject(false)}
      />
      <Header
        title={pageTitle}
        showButton={isAdministrator}
        buttonText={intl.formatMessage({ id: 'CREATE_PROJECT' })}
        onButtonClick={() => setCreatingProject(true)}
      />
      <DataDisplay
        columns={[
          {
            name: 'name',
            label: 'Project',
            options: {
              customBodyRender: value => (
                <Link href={`/projects/${value}`}>{value}</Link>
              ),
            },
          },
          {
            name: 'pid',
            label: 'Project ID',
          },
          {
            name: 'owner',
            label: 'Owner',
          },
        ]}
        data={displayProjects}
      />
    </MainColumn>
  );
}
