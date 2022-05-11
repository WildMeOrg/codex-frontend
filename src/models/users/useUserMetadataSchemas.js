import { useMemo } from 'react';
import { get, map } from 'lodash-es';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/PersonPin';
import AffiliationIcon from '@material-ui/icons/AccountBalance';
// import TwitterIcon from '@material-ui/icons/Twitter'; //deleteMe

import useGetMe from './useGetMe';
import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import { createFieldSchema } from '../../utils/fieldUtils';
import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
import EmailViewer from '../../components/fields/view/EmailViewer';
import ForumIdViewer from '../../components/fields/view/ForumIdViewer';

export default function useUserMetadataSchemas(displayedUserId) {
  const { data: currentUserData, loading, error } = useGetMe();
  const siteSettings = useSiteSettings();
  console.log(
    'deleteMe siteSettings in useUserMetadataSchemas are: ',
  );
  console.log(siteSettings);
  const isTwitterEnabled =
    siteSettings?.data?.intelligent_agent_twitterbot_enabled?.value;
  console.log('deleteMe isTwitterEnabled is: ');
  console.log(isTwitterEnabled);

  const isAdmin = get(currentUserData, 'is_admin', false);
  const isCurrentUser =
    get(currentUserData, 'guid') === displayedUserId;
  const includeEmail = isAdmin || isCurrentUser;

  const userMetadataSchemas = useMemo(
    () => {
      const adminFields = includeEmail
        ? [
            createFieldSchema(fieldTypes.string, {
              name: 'email',
              labelId: 'PROFILE_LABEL_EMAIL',
              icon: EmailIcon,
              viewComponent: EmailViewer,
            }),
          ]
        : [];
      const intelligentAgentFields = map(
        intelligentAgentSchema,
        intelligentAgent => {
          const currentPlatformEnablingField = get(intelligentAgent, [
            'data',
            'enablingField',
          ]);
          console.log('deleteMe currentPlatformEnablingField is: ');
          console.log(currentPlatformEnablingField);
          const isEnabled = get(siteSettings, [
            'data',
            currentPlatformEnablingField,
            'value',
          ]);
          console.log('deleteMe isEnabled is: ');
          console.log(isEnabled);
          const deleteMeSchema = createFieldSchema(
            fieldTypes.string,
            {
              name: intelligentAgent?.userMetadataKey,
              labelId: intelligentAgent?.userMetadataLabel,
              icon: intelligentAgent?.icon,
            },
          );
          console.log('deleteMe deleteMeSchema is: ');
          console.log(deleteMeSchema);
          return isEnabled
            ? createFieldSchema(fieldTypes.string, {
                name: intelligentAgent?.userMetadataKey,
                labelId: intelligentAgent?.userMetadataLabel,
                icon: intelligentAgent?.icon,
              })
            : null;
        },
        [],
      );
      console.log('deleteMe intelligentAgentFields are: ');
      console.log(intelligentAgentFields);
      // const twitterFields = isTwitterEnabled
      //   ? [
      //       createFieldSchema(fieldTypes.string, {
      //         name: 'twitter_username',
      //         labelId: 'TWITTER_HANDLE',
      //         icon: TwitterIcon,
      //       }),
      //     ]
      //   : [];

      return [
        createFieldSchema(fieldTypes.string, {
          name: 'full_name',
          labelId: 'FULL_NAME',
          hideInMetadataCard: true, // name already viewable on page
        }),
        ...adminFields,
        createFieldSchema(fieldTypes.string, {
          name: 'forum_id',
          labelId: 'PROFILE_LABEL_FORUM_ID',
          icon: ForumIcon,
          viewComponent: ForumIdViewer,
        }),
        createFieldSchema(fieldTypes.string, {
          name: 'affiliation',
          labelId: 'PROFILE_LABEL_AFFILIATION',
          icon: AffiliationIcon,
        }),
        createFieldSchema(fieldTypes.string, {
          name: 'location',
          labelId: 'PROFILE_LABEL_LOCATION',
          icon: LocationIcon,
        }),
        ...intelligentAgentFields,
      ];
    },
    [isAdmin, siteSettings],
  );

  if (loading || error) return null;
  return userMetadataSchemas;
}
