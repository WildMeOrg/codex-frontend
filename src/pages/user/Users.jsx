import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import AvatarGallery from '../../components/AvatarGallery';
import MainColumn from '../../components/MainColumn';
import { selectUsers } from '../../modules/users/selectors';
import { selectSiteName } from '../../modules/site/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const intl = useIntl();
  const siteName = useSelector(selectSiteName);
  const pageTitle = intl.formatMessage(
    { id: 'USERS_PAGE_TITLE' },
    { siteName },
  );
  useDocumentTitle(pageTitle, false);

  const users = useSelector(selectUsers);

  const flatUsers = Object.values(users);

  const fakeUsers = [
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
    ...flatUsers,
  ];

  return (
    <MainColumn>
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        {pageTitle}
      </Typography>
      <AvatarGallery
        entities={fakeUsers}
        getHref={entity => `/users/${entity.id}`}
        renderDetails={entities => {
          const affiliation = get(
            entities.fields.find(
              field => field.name === 'affiliation',
            ),
            'value',
            null,
          );
          return affiliation ? (
            <Typography>{affiliation}</Typography>
          ) : null;
        }}
      />
    </MainColumn>
  );
}
