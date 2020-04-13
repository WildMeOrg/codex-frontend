import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import MainColumn from '../../components/MainColumn';
import AvatarGallery from '../../components/AvatarGallery';
import { selectOrgs } from '../../modules/orgs/selectors';
import { selectSiteName } from '../../modules/site/selectors';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function User() {
  const intl = useIntl();
  const siteName = useSelector(selectSiteName);
  const pageTitle = intl.formatMessage(
    { id: 'ORGS_PAGE_TITLE' },
    { siteName },
  );
  useDocumentTitle(pageTitle, false);

  const orgs = useSelector(selectOrgs);

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
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        {pageTitle}
      </Typography>
      <AvatarGallery
        square
        entities={fakeOrgs}
        getHref={entity => `/orgs/${entity.id}`}
        renderDetails={org => {
          const memberCount = get(org, 'data.members.length', null);
          return (
            <Typography>
              <FormattedMessage
                id="MEMBER_COUNT"
                values={{ memberCount }}
              />
            </Typography>
          );
        }}
      />
    </MainColumn>
  );
}
