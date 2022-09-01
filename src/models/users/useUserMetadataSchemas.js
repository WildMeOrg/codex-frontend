import { useMemo } from 'react';
import { get, map, filter } from 'lodash-es';
import ForumIcon from '@material-ui/icons/Forum';
import EmailIcon from '@material-ui/icons/Email';
import LocationIcon from '@material-ui/icons/PersonPin';
import AffiliationIcon from '@material-ui/icons/AccountBalance';

import useGetMe from './useGetMe';
import useSiteSettings from '../site/useSiteSettings';
import fieldTypes from '../../constants/fieldTypesNew';
import { createFieldSchema } from '../../utils/fieldUtils';
import { intelligentAgentSchema } from '../../constants/intelligentAgentSchema';
import EmailViewer from '../../components/fields/view/EmailViewer';
import ForumIdViewer from '../../components/fields/view/ForumIdViewer';

export default function useUserMetadataSchemas(displayedUserId) {
  const { data: currentUserData, loading, error } = useGetMe();
  const { data: siteSettings } = useSiteSettings();

  const isAdmin = get(currentUserData, 'is_admin', false);
  const isCurrentUser =
    get(currentUserData, 'guid') === displayedUserId;
  const includeEmail = isAdmin || isCurrentUser;

  const userMetadataSchemas = useMemo(() => {
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
    const enabledIntelligentAgentFields = filter(
      intelligentAgentSchema,
      intelligentAgent => {
        const currentPlatformEnablingField = get(intelligentAgent, [
          'data',
          'enablingField',
        ]);
        const isEnabled = get(siteSettings, [
          currentPlatformEnablingField,
          'value',
        ]);
        return isEnabled;
      },
    );
    const intelligentAgentFields = map(
      enabledIntelligentAgentFields,
      intelligentAgent =>
        createFieldSchema(fieldTypes.string, {
          name: intelligentAgent.userMetadataKey,
          labelId: intelligentAgent.viewLabelId,
          editLabelId: intelligentAgent.editLabelId,
          icon: intelligentAgent.icon,
        }),
    );

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
  }, [includeEmail, siteSettings]);

  if (loading || error) return null;
  return userMetadataSchemas;
}
