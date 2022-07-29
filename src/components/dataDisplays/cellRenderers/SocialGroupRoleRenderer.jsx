import React from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import useSiteSettings from '../../../models/site/useSiteSettings';
import Text from '../../Text';
import OverflowController from './OverflowController';

export default function SocialGroupRoleRenderer({
  value,
  noWrap = false,
  ...rest
}) {
  const intl = useIntl();

  const { data } = useSiteSettings();
  const roles = get(data, ['social_group_roles', 'value'], []);
  const matchingRole = roles.find(role => role?.guid === value);
  const label =
    matchingRole?.label || intl.formatMessage({ id: 'UNKNOWN_ROLE' });

  return noWrap ? (
    <OverflowController title={label}>
      <Text variant="body2" {...rest}>
        {label}
      </Text>
    </OverflowController>
  ) : (
    <Text variant="body2" {...rest}>
      {label}
    </Text>
  );
}
